import { defineArrayMember, defineField, defineType } from "sanity"
import { HelpCircleIcon } from "@sanity/icons/HelpCircle"

import { ICON_OPTIONS } from "./objects/iconOptions"

export const helpCenter = defineType({
  name: "helpCenter",
  title: "Help center",
  type: "document",
  icon: HelpCircleIcon,
  groups: [
    { name: "intro", title: "Intro" },
    { name: "faq", title: "FAQ" },
    { name: "policies", title: "Policies" },
    { name: "support", title: "Support" },
  ],
  fields: [
    defineField({
      name: "intro",
      type: "object",
      group: "intro",
      fields: [
        defineField({
          name: "heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "body", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "faqGroups",
      title: "FAQ groups",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqGroup",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "groupId",
              title: "Anchor id",
              type: "slug",
              description: "Used for the #anchor link and the jump-to navigation",
              options: { source: "title" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Questions",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "faqItem",
                  fields: [
                    defineField({
                      name: "question",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "answer",
                      type: "text",
                      rows: 4,
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: "question" } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({
              title,
              subtitle: `${items?.length ?? 0} questions`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "policies",
      type: "array",
      group: "policies",
      of: [
        defineArrayMember({
          type: "object",
          name: "policy",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: { list: [...ICON_OPTIONS], layout: "dropdown" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "summary",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "summary" } },
        }),
      ],
    }),
    defineField({
      name: "supportChannels",
      title: "Support channels",
      type: "array",
      group: "support",
      of: [
        defineArrayMember({
          type: "object",
          name: "supportChannel",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: { list: [...ICON_OPTIONS], layout: "dropdown" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "detail",
              type: "text",
              rows: 2,
              description: "Contact detail or hours. Line breaks are preserved on the site.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "detail" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Help center" }),
  },
})
