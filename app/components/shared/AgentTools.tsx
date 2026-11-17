
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BRAND, STUDIOS } from "../../brand";
import { ROUTES } from "../../routes";

// WebMCP: a few read-only tools AI agents can call on any page, so they can find their way
// around the site without scraping it. Only registered in browsers that support WebMCP;
// everywhere else this renders nothing and does nothing.

type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      title?: string;
      description: string;
      inputSchema?: object;
      annotations?: { readOnlyHint?: boolean };
      execute: (input: Record<string, unknown>) => Promise<unknown>;
    },
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void;
};

const PAGES = [
  { path: ROUTES.home, title: "Home", summary: "The studio, selected work, process and services" },
  { path: ROUTES.work, title: "Work", summary: "Every project, filterable by discipline" },
  { path: ROUTES.services, title: "Services", summary: "The six disciplines, pricing and a brief builder" },
  { path: ROUTES.about, title: "About", summary: "Beliefs, team, studios and awards" },
  { path: ROUTES.blog, title: "Journal", summary: "Articles from the studio" },
];

const AgentTools = () => {
  const router = useRouter();

  useEffect(() => {
    const context =
      (document as Document & { modelContext?: ModelContext }).modelContext ??
      (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!context || typeof context.registerTool !== "function") return;

    const controller = new AbortController();
    const register = (tool: Parameters<ModelContext["registerTool"]>[0]) => {
      try {
        Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => {});
      } catch {}
    };

    register({
      name: "list_pages",
      title: "List site pages",
      description: `List the main pages of the ${BRAND.name} studio website with their paths and what each one covers.`,
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => PAGES,
    });

    register({
      name: "get_studio_contact",
      title: "Get studio contact details",
      description: `Get ${BRAND.name}'s email address and the addresses and opening hours of its studios.`,
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => ({
        email: BRAND.email,
        studios: STUDIOS.map((studio) => ({
          city: studio.city,
          country: studio.country,
          address: studio.address.join(", "),
          hours: `${studio.opens}:00-${studio.closes}:00 local time (${studio.zone})`,
        })),
        enquiryEmail: BRAND.email,
      }),
    });

    register({
      name: "open_page",
      title: "Open a site page",
      description: "Navigate the browser to one of the site's main pages. Use list_pages to see the available paths.",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "The page path, as listed by list_pages", enum: PAGES.map((page) => page.path) },
        },
        required: ["path"],
      },
      execute: async (input) => {
        const page = PAGES.find((item) => item.path === input.path);
        if (!page) return `Unknown page. Available: ${PAGES.map((item) => item.path).join(", ")}`;
        router.push(page.path);
        return `Opening ${page.title}.`;
      },
    });

    return () => controller.abort();
  }, [router]);

  return null;
};

export default AgentTools;
