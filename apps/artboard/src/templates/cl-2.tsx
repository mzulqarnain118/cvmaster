import {
  CustomSection,
  CustomSectionGroup,
  SectionKey,
  SectionWithItem,
  Skill,
  URL,
  Volunteer,
} from "@reactive-resume/schema";
import { cn, hexToRgb, isEmptyString, isUrl, linearTransform } from "@reactive-resume/utils";
import get from "lodash.get";
import { Fragment } from "react";

import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";
import { Recipient } from "./recipient";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="space-y-4">
        <div>
          <div className="text-2xl font-bold break-words max-w-[200px]">{basics.name}</div>
          <div className="text-base break-words max-w-[200px]">{basics.headline}</div>
        </div>

        <div className="flex flex-col items-start gap-y-1. rounded border border-primary px-3 py-4 text-left text-sm">
          {basics.location && (
            <div className="flex items-center gap-x-1.5 ">
              <i className="ph ph-bold ph-map-pin text-primary flex-shrink-0" />
              <div className="break-words max-w-[200px]">{basics.location}</div>
            </div>
          )}
          {basics.phone && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-phone text-primary flex-shrink-0" />
              <a
                className="break-words max-w-[200px]"
                href={`tel:${basics.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                {basics.phone}
              </a>
            </div>
          )}
          {basics.email && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-at text-primary flex-shrink-0" />
              <a
                className="break-words max-w-[200px]"
                href={`mailto:${basics.email}`}
                target="_blank"
                rel="noreferrer"
              >
                {basics.email}
              </a>
            </div>
          )}
          <Link className="break-words max-w-[200px]" url={basics.url} />
          {basics.customFields.map((item) => (
            <div key={item.id} className="flex items-center gap-x-1.5">
              <i className={cn(`ph ph-bold ph-${item.icon} text-primary flex-shrink-0`)} />
              {isUrl(item.value) ? (
                <a
                  className="break-words max-w-[200px]"
                  href={item.value}
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                >
                  {item.name || item.value}
                </a>
              ) : (
                <span className="break-words max-w-[200px]">
                  {[item.name, item.value].filter(Boolean).join(": ")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id}>
      <h4 className="mb-2 border-b pb-0.5 text-sm font-bold">{section.name}</h4>

      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        className="wysiwyg"
        style={{ columns: section.columns }}
      />
    </section>
  );
};

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => {
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);

  return (
    <div className="relative">
      <div
        className="h-2.5 w-full rounded-sm"
        style={{ backgroundColor: hexToRgb(primaryColor, 0.4) }}
      />
      <div
        className="absolute inset-y-0 left-0 h-2.5 w-full rounded-sm bg-primary"
        style={{ width: `${linearTransform(level, 0, 5, 0, 100)}%` }}
      />
    </div>
  );
};

type LinkProps = {
  url: URL;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, iconOnRight, label, className }: LinkProps) => {
  if (!isUrl(url.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight &&
        (icon ?? <i className="ph ph-bold ph-link text-primary group-[.sidebar]:text-primary" />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight &&
        (icon ?? <i className="ph ph-bold ph-link text-primary group-[.sidebar]:text-primary" />)}
    </div>
  );
};

type LinkedEntityProps = {
  name: string;
  url: URL;
  separateLinks: boolean;
  className?: string;
};

const LinkedEntity = ({ name, url, separateLinks, className }: LinkedEntityProps) => {
  return !separateLinks && isUrl(url.href) ? (
    <Link
      url={url}
      label={name}
      icon={<i className="ph ph-bold ph-globe text-primary group-[.sidebar]:text-primary" />}
      iconOnRight={true}
      className={className}
    />
  ) : (
    <div className={className}>{name}</div>
  );
};

type SectionProps<T> = {
  section: SectionWithItem<T> | CustomSectionGroup;
  children?: (item: T) => React.ReactNode;
  className?: string;
  urlKey?: keyof T;
  levelKey?: keyof T;
  summaryKey?: keyof T;
  keywordsKey?: keyof T;
};

const Section = <T,>({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
}: SectionProps<T>) => {
  if (!section.visible || section.items.length === 0) return null;

  return (
    <section id={section.id} className="grid">
      <h4 className="mb-2 border-b pb-0.5 text-sm font-bold group-[.sidebar]:text-primary">
        {section.name}
      </h4>

      <div
        className="grid gap-x-6 gap-y-3"
        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
      >
        {section.items
          .filter((item) => item.visible)
          .map((item) => {
            const url = (urlKey && get(item, urlKey)) as URL | undefined;
            const level = (levelKey && get(item, levelKey, 0)) as number | undefined;
            const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
            const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

            return (
              <div key={item.id} className={cn("space-y-2", className)}>
                <div>
                  {children?.(item as T)}
                  {url !== undefined && section.separateLinks && <Link url={url} />}
                </div>

                {summary !== undefined && !isEmptyString(summary) && (
                  <div dangerouslySetInnerHTML={{ __html: summary }} className="wysiwyg" />
                )}

                {level !== undefined && level > 0 && <Rating level={level} />}

                {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm">{keywords.join(", ")}</p>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};

const Custom = ({ id }: { id: string }) => {
  const section = useArtboardStore((state) => state.resume.sections.custom[id]);

  return (
    <Section<CustomSection>
      section={section}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.description}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const mapSectionToComponent = (section: SectionKey) => {
  switch (section) {
    case "summary": {
      return <Summary />;
    }

    default: {
      if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

      return null;
    }
  }
};

export const CoverLetter2 = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;

  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);

  return (
    <div className="grid min-h-[inherit] grid-cols-3">
      <div
        className="sidebar p-custom group space-y-4"
        style={{ backgroundColor: hexToRgb(primaryColor, 0.2) }}
      >
        {isFirstPage && <Header />}
        {isFirstPage && <Recipient />}

        {sidebar.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>

      <div className="main p-custom group col-span-2 space-y-4">
        {main.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>
    </div>
  );
};
