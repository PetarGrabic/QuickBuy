import { defineCliConfig } from "sanity/cli"

import { dataset, projectId } from "./sanity/env"

export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: false,
  // Studio is embedded in the Next.js app at /studio, not built by the Sanity CLI.
  typegen: {
    path: "./**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
    // Content is fetched through lib/sanity/fetch.ts with an explicit generic,
    // so we don't need the @sanity/client method-overload augmentation (which
    // also can't resolve @sanity/client as it's a transitive dependency).
    overloadClientMethods: false,
  },
})
