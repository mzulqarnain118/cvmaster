/* eslint-disable lingui/no-unlocalized-strings */

import { t } from "@lingui/macro";
import { Helmet } from "react-helmet-async";

export const PrivacyPolicyPage = () => (
  <main className="relative isolate bg-background">
    <Helmet prioritizeSeoTags>
      <title>
        {t`Privacy Policy`} - {t`CV Master`}
      </title>

      <meta
        name="description"
        content="CV Master that simplifies the process of creating, updating, and sharing your resume."
      />
    </Helmet>

    <section
      id="privacy-policy"
      className="container prose prose-zinc relative max-w-4xl py-32 dark:prose-invert"
    >
      <h1 className="mb-4">{t`Privacy Policy`}</h1>
      <h6 className="text-sm">Last updated on 3rd May 2024</h6>

      <hr className="my-6" />

      <ol>
        <li>
          <h2 className="mb-2">Introduction</h2>
          <p>
            This privacy policy outlines how we collect, use, and protect the personal information
            you provide when using our web application. By accessing or using CV Master, you
            agree to the collection and use of information in accordance with this policy.
          </p>
        </li>

        <li>
          <h2 className="mb-2">Information Collection and Use</h2>
          <p>
            For a better experience while using our Service, we may require you to provide us with
            certain personally identifiable information, including but not limited to your name and
            email address. The information that we collect will be used to contact or identify you
            primarily for the following purposes:
          </p>

          <ul>
            <li>
              <strong>Account Creation:</strong> to allow you to create and manage your account.
            </li>
            <li>
              <strong>Functionality:</strong> to enable the various features of the application that
              you choose to utilize, such as building and saving resumes.
            </li>
          </ul>
        </li>

        <li>
          <h2 className="mb-2">How We Collect Information</h2>
          <p>
            All personal data is provided directly by you. We collect information through our web
            application when you voluntarily provide it to us as part of using our service.
          </p>
        </li>

        <li>
          <h2 className="mb-2">Data Security</h2>
          <p>
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi delectus nulla cumque nesciunt veniam, dignissimos obcaecati velit necessitatibus laboriosam aspernatur.
          </p>
        </li>

        <li>
          <h2 className="mb-2">Data Retention</h2>
          <p>
           Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique commodi odit laudantium, soluta aspernatur aut. Temporibus suscipit rem ut repellat architecto fugiat? Est vero cumque expedita deleniti at, aliquid rem.
          </p>
        </li>

        <li>
          <h2 className="mb-2">Third-Party Disclosure</h2>
          <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem consequuntur deserunt magnam aliquid sit illo pariatur odio numquam alias necessitatibus magni voluptates voluptatem veritatis fugit, facilis tempore totam saepe. Obcaecati.
          </p>
        </li>

        <li>
          <h2 className="mb-2">Changes to This Privacy Policy</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio iusto sunt laboriosam recusandae eos perspiciatis at consequatur quo sed id quae, dolorem accusantium a doloribus inventore. Ratione officiis nulla temporibus?
          </p>
        </li>

        <li>
          <h2 className="mb-2">Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to
            contact us at <code>softech systems</code>.
          </p>
        </li>
      </ol>
    </section>
  </main>
);
