import { recipientSchema } from "@reactive-resume/schema";
import { Input, Label } from "@reactive-resume/ui";

import { useResumeStore } from "@/client/stores/resume";

import { CustomFieldsSection } from "./custom/section";
import { getSectionIcon } from "./shared/section-icon";

export const RecipientSection = () => {
  const setValue = useResumeStore((state) => state.setValue);
  const recipient = useResumeStore((state) => state.resume.data.recipient);

  return (
    <section id="recipient" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("recipient")}
          <h2 className="line-clamp-1 text-3xl font-bold">{`Recipient`}</h2>
        </div>
      </header>

      <main className="grid gap-4 sm:grid-cols-2">
        {/* Recipient Information */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="recipient.recipient">{`Recipient Name`}</Label>
          <Input
            id="recipient.recipient"
            placeholder="Recipient Name"
            value={recipient?.name}
            onChange={(event) => setValue("recipient.name", event.target.value)}
          />
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <Label htmlFor="recipient.date">{`Date`}</Label>
          <Input
            id="recipient.date"
            placeholder="MM/DD/YYYY"
            type="date"
            value={recipient?.date}
            onChange={(event) => {
              const dateValue = event.target.value;
              const formattedDate = dateValue ? new Date(dateValue).toISOString().split('T')[0] : '';
              setValue("recipient.date", formattedDate);
            }}
          />
        </div>

        {/* Greeting */}
        <div className="space-y-1.5">
          <Label htmlFor="recipient.greeting">{`Greeting`}</Label>
          <Input
            id="recipient.greeting"
            placeholder="Dear [Name],"
            value={recipient?.greeting}
            onChange={(event) => setValue("recipient.greeting", event.target.value)}
          />
        </div>

        {/* Subject */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="recipient.subject">{`Subject`}</Label>
          <Input
            id="recipient.subject"
            placeholder="Subject of the letter"
            value={recipient?.subject}
            onChange={(event) => setValue("recipient.subject", event.target.value)}
          />
        </div>


        {/* More existing fields and CustomFieldsSection as before */}
        <div className="space-y-1.5">
          <Label htmlFor="recipient.email">{`Email`}</Label>
          <Input
            id="recipient.email"
            placeholder="john.doe@example.com"
            value={recipient?.email}
            hasError={
              !recipientSchema.pick({ email: true }).safeParse({ email: recipient?.email }).success
            }
            onChange={(event) => {
              setValue("recipient.email", event.target.value);
            }}
          />
        </div>

        {/* Additional fields as shown earlier */}
        <CustomFieldsSection className="sm:col-span-2" />
      </main>
    </section>
  );
};
