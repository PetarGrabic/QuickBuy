import { defineField, defineType } from "sanity"
import { LinkIcon } from "@sanity/icons/Link"

export const ctaLink = defineType({
  name: "ctaLink",
  title: "Link / button",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "Internal path such as /shop or /shop?discounted=1, or an absolute URL",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
})
