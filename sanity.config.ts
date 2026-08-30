"use client"

import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

import { apiVersion, dataset, projectId } from "./sanity/env"
import { schemaTypes } from "./sanity/schemaTypes"
import { SINGLETON_TYPES, structure } from "./sanity/structure"

const PUBLISH_ONLY_ACTIONS = new Set(["publish", "discardChanges", "restore"])

export default defineConfig({
  name: "default",
  title: "QuickBuy",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Singletons can't be created or deleted from the desk.
    templates: (prev) => prev.filter((t) => !SINGLETON_TYPES.has(t.schemaType)),
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? [] : prev,
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter((a) => a.action && PUBLISH_ONLY_ACTIONS.has(a.action))
        : prev,
  },
})
