import type { StructureResolver } from "sanity/structure"
import { CogIcon } from "@sanity/icons/Cog"
import { HomeIcon } from "@sanity/icons/Home"
import { HelpCircleIcon } from "@sanity/icons/HelpCircle"
import { MenuIcon } from "@sanity/icons/Menu"

// Every content type in this Studio is a singleton edited through a fixed document id.
export const SINGLETONS = [
  { id: "siteSettings", title: "Site settings", icon: CogIcon },
  { id: "homePage", title: "Home page", icon: HomeIcon },
  { id: "helpCenter", title: "Help center", icon: HelpCircleIcon },
  { id: "footer", title: "Footer", icon: MenuIcon },
] as const

export const SINGLETON_TYPES: ReadonlySet<string> = new Set(
  SINGLETONS.map((s) => s.id)
)

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items(
      SINGLETONS.map(({ id, title, icon }) =>
        S.listItem()
          .title(title)
          .id(id)
          .icon(icon)
          .child(S.document().schemaType(id).documentId(id).title(title))
      )
    )
