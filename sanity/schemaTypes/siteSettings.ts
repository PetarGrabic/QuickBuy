import { defineField, defineType } from "sanity"
import { CogIcon } from "@sanity/icons/Cog"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Browser tab title and default SEO title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      description: "Default meta description",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      options: { hotspot: true },
      description: "Optional. Used for link previews when not overridden per page.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
})
