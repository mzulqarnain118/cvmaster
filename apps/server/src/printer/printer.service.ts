import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fontkit from "@pdf-lib/fontkit";
import { ResumeDto } from "@reactive-resume/dto";
import { ErrorMessage, getFontUrls } from "@reactive-resume/utils";
import retry from "async-retry";
import { PDFDocument } from "pdf-lib";
import { connect } from "puppeteer";

import { Config } from "../config/schema";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class PrinterService {
  private readonly logger = new Logger(PrinterService.name);

  private readonly browserURL: string;

  private readonly ignoreHTTPSErrors: boolean;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly storageService: StorageService,
    private readonly httpService: HttpService,
  ) {
    const chromeUrl = this.configService.getOrThrow<string>("CHROME_URL");
    const chromeToken = this.configService.getOrThrow<string>("CHROME_TOKEN");

    this.browserURL = `${chromeUrl}?token=${chromeToken}`;
    this.ignoreHTTPSErrors = this.configService.getOrThrow<boolean>("CHROME_IGNORE_HTTPS_ERRORS");
  }

  private async getBrowser() {
    try {
      return await connect({
        browserWSEndpoint: this.browserURL,
        ignoreHTTPSErrors: this.ignoreHTTPSErrors,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ErrorMessage.InvalidBrowserConnection,
        (error as Error).message,
      );
    }
  }

  async getVersion() {
    const browser = await this.getBrowser();
    const version = await browser.version();
    await browser.disconnect();
    return version;
  }

  async printResume(resume: ResumeDto) {
    const start = performance.now();

    const url = await retry<string | undefined>(() => this.generateResume(resume), {
      retries: 3,
      randomize: true,
      onRetry: (_, attempt) => {
        this.logger.log(`Retrying to print resume #${resume.id}, attempt #${attempt}`);
      },
    });

    const duration = Number(performance.now() - start).toFixed(0);
    const numberPages = resume.data.metadata.layout.length;

    this.logger.debug(`Chrome took ${duration}ms to print ${numberPages} page(s)`);

    return url;
  }

  async printPreview(resume: ResumeDto) {
    const start = performance.now();

    const url = await retry(() => this.generatePreview(resume), {
      retries: 3,
      randomize: true,
      onRetry: (_, attempt) => {
        this.logger.log(
          `Retrying to generate preview of resume #${resume.id}, attempt #${attempt}`,
        );
      },
    });

    const duration = Number(performance.now() - start).toFixed(0);

    this.logger.debug(`Chrome took ${duration}ms to generate preview`);

    return url;
  }

  async generateResume(resume: ResumeDto) {
    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      const publicUrl = this.configService.getOrThrow<string>("PUBLIC_URL");
      const storageUrl = this.configService.getOrThrow<string>("STORAGE_URL");

      let url = publicUrl;

      if ([publicUrl, storageUrl].some((url) => url.includes("localhost"))) {
        url = url.replace("localhost", "host.docker.internal");

        await page.setRequestInterception(true);
        page.on("request", (request) => {
          if (request.url().startsWith(storageUrl)) {
            const modifiedUrl = request.url().replace("localhost", `host.docker.internal`);
            void request.continue({ url: modifiedUrl });
          } else {
            void request.continue();
          }
        });
      }

      // Set resume data in localStorage
      const numberPages = resume.data.metadata.layout.length;
      await page.evaluateOnNewDocument((data) => {
        window.localStorage.setItem("resume", JSON.stringify(data));
      }, resume.data);

      // After navigating to the page with Puppeteer
      await page.goto(`${url}/artboard/preview`, { waitUntil: "networkidle0", timeout: 20000 });

      await page.evaluate((resume) => {
        // Check if recipient data exists
        if (resume.type === "coverLetter" && resume.data && resume.data.recipient) {
          const recipientData = resume.data.recipient;

          // Create the Recipient section
          const recipientSection = document.createElement("div");
          recipientSection.id = "recipient-section";
          recipientSection.innerHTML = `
      <p><strong>Date:</strong> ${recipientData.date || ""}</p>
      <p><strong>Greeting:</strong> ${recipientData.greeting || ""}</p>
      <p><strong>Subject:</strong> ${recipientData.subject || ""}</p>
      <p><strong>Name:</strong> ${recipientData.name || ""}</p>
      <p><strong>Email:</strong> ${recipientData.email || ""}</p>
    `;

          // Find the summary section
          const summarySection = document.querySelector("#summary");

          // Insert the Recipient section before the summary section
          if (summarySection && summarySection.parentNode) {
            summarySection.parentNode.insertBefore(recipientSection, summarySection);
          }
        }
      }, resume);

      // Optionally, log the body content to verify
      const pageContent = await page.evaluate(() => document.body.innerHTML);
      console.log("Page content after appending Recipient section:", pageContent);

      const pagesBuffer: Buffer[] = [];

      // Process each page
      const processPage = async (index: number) => {
        const pageElement = await page.$(`[data-page="${index}"]`);
        if (pageElement) {
          // Log the outer HTML of the page element
          const elementHtml = await page.evaluate((el) => el.outerHTML, pageElement);
          console.log("Page element HTML:", elementHtml);

          // Continue processing
          const width = (await (await pageElement?.getProperty("scrollWidth"))?.jsonValue()) ?? 0;
          const height = (await (await pageElement?.getProperty("scrollHeight"))?.jsonValue()) ?? 0;

          const temporaryHtml = await page.evaluate((element: HTMLDivElement) => {
            const clonedElement = element.cloneNode(true) as HTMLDivElement;
            const temporaryHtml_ = document.body.innerHTML;
            document.body.innerHTML = clonedElement.outerHTML;
            return temporaryHtml_;
          }, pageElement);

          pagesBuffer.push(await page.pdf({ width, height, printBackground: true }));

          await page.evaluate((temporaryHtml_: string) => {
            document.body.innerHTML = temporaryHtml_;
          }, temporaryHtml);
        } else {
          console.log(`Page element for index ${index} not found`);
        }
      };

      // Loop through all pages
      for (let index = 1; index <= numberPages; index++) {
        await processPage(index);
      }

      // Merge all pages into a single PDF
      const pdf = await PDFDocument.create();
      pdf.registerFontkit(fontkit);

      const fontData = resume.data.metadata.typography.font;
      const fontUrls = getFontUrls(fontData.family, fontData.variants);

      const responses = await Promise.all(
        fontUrls.map((url) => this.httpService.axiosRef.get(url, { responseType: "arraybuffer" })),
      );
      const fontsBuffer = responses.map((response) => response.data as ArrayBuffer);

      await Promise.all(fontsBuffer.map((buffer) => pdf.embedFont(buffer)));

      for (const element of pagesBuffer) {
        const page = await PDFDocument.load(element);
        const [copiedPage] = await pdf.copyPages(page, [0]);
        pdf.addPage(copiedPage);
      }

      const buffer = Buffer.from(await pdf.save());
      const resumeUrl = await this.storageService.uploadObject(
        resume.userId,
        "resumes",
        buffer,
        resume.title,
      );

      await page.close();
      await browser.disconnect();

      return resumeUrl;
    } catch (error) {
      console.trace(error);
    }
  }

  async generatePreview(resume: ResumeDto) {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    const publicUrl = this.configService.getOrThrow<string>("PUBLIC_URL");
    const storageUrl = this.configService.getOrThrow<string>("STORAGE_URL");

    let url = publicUrl;

    if ([publicUrl, storageUrl].some((url) => url.includes("localhost"))) {
      // Switch client URL from `localhost` to `host.docker.internal` in development
      // This is required because the browser is running in a container and the client is running on the host machine.
      url = url.replace("localhost", "host.docker.internal");

      await page.setRequestInterception(true);

      // Intercept requests of `localhost` to `host.docker.internal` in development
      page.on("request", (request) => {
        if (request.url().startsWith(storageUrl)) {
          const modifiedUrl = request.url().replace("localhost", `host.docker.internal`);

          void request.continue({ url: modifiedUrl });
        } else {
          void request.continue();
        }
      });
    }

    // Set the data of the resume to be printed in the browser's session storage
    await page.evaluateOnNewDocument((data) => {
      window.localStorage.setItem("resume", JSON.stringify(data));
    }, resume.data);

    await page.setViewport({ width: 794, height: 1123 });

    await page.goto(`${url}/artboard/preview`, { waitUntil: "networkidle0", timeout: 20_000 });

    // Save the JPEG to storage and return the URL
    // Store the URL in cache for future requests, under the previously generated hash digest
    const buffer = await page.screenshot({ quality: 80, type: "jpeg" });

    // Generate a hash digest of the resume data, this hash will be used to check if the resume has been updated
    const previewUrl = await this.storageService.uploadObject(
      resume.userId,
      "previews",
      buffer,
      resume.id,
    );

    // Close all the pages and disconnect from the browser
    await page.close();
    await browser.disconnect();

    return previewUrl;
  }
}
