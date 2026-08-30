import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { HELP_CENTER_QUERY_RESULT } from "@/sanity.types"

type FaqGroups = NonNullable<NonNullable<HELP_CENTER_QUERY_RESULT>["faqGroups"]>

function FaqSection({ groups }: { groups: FaqGroups }) {
  return (
    <section id="faq" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-2 sm:px-6 md:py-12 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Quick answers to the things shoppers ask us most.
        </p>

        <div className="mt-2 divide-border border-border sm:divide-y sm:border-y md:mt-8">
          {groups.map((group, groupIndex) => (
            <div
              key={group._key}
              id={group.groupId ?? undefined}
              className="scroll-mt-24 py-4 md:grid md:grid-cols-[9.5rem_1fr] md:gap-x-10 md:py-7"
            >
              <h3 className="text-base font-semibold tracking-tight text-foreground md:pt-3.5">
                {group.title}
              </h3>
              <Accordion
                multiple
                className="mt-2 md:mt-0 [&>*:last-child]:border-b-0"
              >
                {(group.items ?? []).map((item, itemIndex) => (
                  <AccordionItem
                    key={item._key}
                    value={`${groupIndex}-${itemIndex}`}
                  >
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { FaqSection }
