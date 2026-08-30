import { defineArrayMember, defineField, defineType } from "sanity"
import { MenuIcon } from "@sanity/icons/Menu"

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "tagline",
      type: "text",
      rows: 2,
      description: "Short line under the QuickBuy wordmark",
    }),
    defineField({
      name: "linkColumns",
      title: "Link columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "linkColumn",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "links",
              type: "array",
              of: [defineArrayMember({ type: "ctaLink" })],
            }),
          ],
          preview: {
            select: { title: "title", links: "links" },
            prepare: ({ title, links }) => ({
              title,
              subtitle: `${links?.length ?? 0} links`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "X", value: "x" },
                  { title: "YouTube", value: "youtube" },
                ],
                layout: "dropdown",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer" }),
  },
})
