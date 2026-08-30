import { defineArrayMember, defineField, defineType } from "sanity"
import { HomeIcon } from "@sanity/icons/Home"

import { ICON_OPTIONS } from "./objects/iconOptions"

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "promo", title: "Promo banner" },
    { name: "trust", title: "Trust bar" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "heading",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "subheading",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "primaryCta", title: "Primary button", type: "ctaLink" }),
        defineField({ name: "secondaryCta", title: "Secondary button", type: "ctaLink" }),
      ],
    }),
    defineField({
      name: "promo",
      type: "object",
      group: "promo",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          description: "Small label above the heading",
        }),
        defineField({
          name: "heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "body", type: "text", rows: 2 }),
        defineField({ name: "cta", title: "Button", type: "ctaLink" }),
      ],
    }),
    defineField({
      name: "trustItems",
      title: "Trust bar items",
      type: "array",
      group: "trust",
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: "object",
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
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home page" }),
  },
})
