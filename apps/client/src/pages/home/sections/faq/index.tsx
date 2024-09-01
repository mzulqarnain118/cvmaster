/* eslint-disable lingui/text-restrictions */
/* eslint-disable lingui/no-unlocalized-strings */

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";

import { useLanguages } from "@/client/services/resume/translation";

// Who are you, and why did you build CV Master?
const Question1 = () => (
  <AccordionItem value="1">
    <AccordionTrigger className="text-left leading-relaxed">
      Who are you, and why did you build CV Master?
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>
    </AccordionContent>
  </AccordionItem>
);

// How much does it cost to run CV Master?
const Question2 = () => (
  <AccordionItem value="2">
    <AccordionTrigger className="text-left leading-relaxed">
      How much does it cost to run CV Master?
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>
    </AccordionContent>
  </AccordionItem>
);

//how can I support you?
const Question3 = () => (
  <AccordionItem value="3">
    <AccordionTrigger className="text-left leading-relaxed">
    how can I support you?
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
        <strong>If you speak a language other than English</strong>, sign up to be a translator on{" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>

      <p>
        <strong>If you found a bug or have an idea for a feature</strong>, raise an issue on{" "}
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
      </p>
    </AccordionContent>
  </AccordionItem>
);

// What languages are supported on CV Master?
const Question4 = () => {
  const { languages } = useLanguages();

  return (
    <AccordionItem value="4">
      <AccordionTrigger className="text-left leading-relaxed">
        What languages are supported on CV Master?
      </AccordionTrigger>
      <AccordionContent className="prose max-w-none dark:prose-invert">
        <p>
          Here are the languages currently supported by CV Master, along with their respective
          completion percentages.
        </p>

        <div className="flex flex-wrap items-start justify-start gap-x-2 gap-y-4">
          {languages.map((language) => (
            <a
              key={language.id}
              className="no-underline"
              href={`https://crowdin.com/translate/reactive-resume/all/en-${language.editorCode}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="relative bg-secondary-accent font-medium transition-colors hover:bg-primary hover:text-background">
                <span className="px-2 py-1">{language.name}</span>

                {language.progress !== undefined && (
                  <span
                    className={cn(
                      "inset-0 bg-warning px-1.5 py-1 text-xs text-white",
                      language.progress < 40 && "bg-error",
                      language.progress > 80 && "bg-success",
                    )}
                  >
                    {language.progress}%
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>

        <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
        </p>

        <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dignissimos fugiat ea natus quod consequatur, obcaecati quisquam nostrum facere pariatur aliquam minus similique aspernatur? Animi quis doloribus nostrum dignissimos magni quasi omnis distinctio facere consequuntur suscipit culpa inventore, quibusdam aspernatur.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

// How does the OpenAI Integration work?


export const FAQSection = () => (
  <section id="faq" className="container relative py-24 sm:py-32">
    <div className="grid gap-12 lg:grid-cols-3">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>

        <p className="text-base leading-loose">
          Here are some questions I often get asked about CV Master.
        </p>

        <p className="text-sm leading-loose">
          Unfortunately, this section is available only in English, as I do not want to burden
          translators with having to translate these large paragraphs of text.
        </p>
      </div>

      <div className="col-span-2">
        <Accordion collapsible type="single">
          <Question1 />
          <Question2 />
          <Question3 />
          <Question4 />

        </Accordion>
      </div>
    </div>
  </section>
);
