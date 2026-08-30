import { defineQuery } from "next-sanity"

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    description,
    "ogImage": ogImage.asset->url
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    hero{
      heading,
      subheading,
      primaryCta{ label, href },
      secondaryCta{ label, href }
    },
    promo{
      eyebrow,
      heading,
      body,
      cta{ label, href }
    },
    trustItems[]{
      _key,
      icon,
      title,
      description
    }
  }
`)

export const HELP_CENTER_QUERY = defineQuery(`
  *[_type == "helpCenter"][0]{
    intro{ heading, body },
    faqGroups[]{
      _key,
      title,
      "groupId": groupId.current,
      items[]{ _key, question, answer }
    },
    policies[]{ _key, icon, title, summary },
    supportChannels[]{ _key, icon, title, description, detail }
  }
`)

export const FOOTER_QUERY = defineQuery(`
  *[_type == "footer"][0]{
    tagline,
    linkColumns[]{
      _key,
      title,
      links[]{ _key, label, href }
    },
    socials[]{ _key, platform, url }
  }
`)
