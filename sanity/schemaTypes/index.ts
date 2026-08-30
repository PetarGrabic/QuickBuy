import type { SchemaTypeDefinition } from "sanity"

import { ctaLink } from "./objects/ctaLink"
import { footer } from "./footer"
import { helpCenter } from "./helpCenter"
import { homePage } from "./homePage"
import { siteSettings } from "./siteSettings"

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homePage,
  helpCenter,
  footer,
  ctaLink,
]
