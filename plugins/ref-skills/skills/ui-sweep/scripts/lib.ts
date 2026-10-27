/**
 * Generic Playwright helpers for a UI sweep.
 * Prefer project helpers from INVENTORY.md when they exist; use these only for gaps.
 *
 * The orchestrator fills in `signIn` per project (see `configureSignIn`).
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright";

export type ShotMeta = {
  title: string;
  description: string;
  area: string;
  state: string;
  bugs?: Array<{
    severity: string;
    repro: string;
    suspectedFile: string;
    fixProposal: string;
  }>;
};

export type ShotRecord = ShotMeta & {
  file: string;
  viewport: string;
  bugs: NonNullable<ShotMeta["bugs"]>;
};

export type SignInFn = (page: Page, user: string) => Promise<void>;

let signInImpl: SignInFn = async () => {
  throw new Error(
    "signIn is not configured. Call configureSignIn(fn) with a project-specific implementation.",
  );
};

/** Orchestrator sets this once from project seed/sign-in helpers. */
export function configureSignIn(fn: SignInFn): void {
  signInImpl = fn;
}

export async function signIn(page: Page, user: string): Promise<void> {
  return signInImpl(page, user);
}

export type NewPageOptions = {
  baseURL: string;
  width?: number;
  height?: number;
  headless?: boolean;
};

export type PageSession = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  close: () => Promise<void>;
};

/** Launch a headed/headless page at the sandbox base URL. */
export async function newPage(opts: NewPageOptions): Promise<PageSession> {
  const width = opts.width ?? 1440;
  const height = opts.height ?? 900;
  const browser = await chromium.launch({ headless: opts.headless ?? true });
  const context = await browser.newContext({
    baseURL: opts.baseURL,
    viewport: { width, height },
  });
  const page = await context.newPage();
  return {
    browser,
    context,
    page,
    close: async () => {
      await context.close();
      await browser.close();
    },
  };
}

/**
 * Screenshot into `<groupDir>/<name>.png` and append a record to
 * `<groupDir>/manifest.json`.
 */
export async function shot(
  page: Page,
  groupDir: string,
  name: string,
  meta: ShotMeta,
): Promise<ShotRecord> {
  await mkdir(groupDir, { recursive: true });
  const file = `${name}.png`;
  const pngPath = path.join(groupDir, file);
  await page.screenshot({ path: pngPath, fullPage: true });

  const viewport = page.viewportSize();
  const record: ShotRecord = {
    file,
    title: meta.title,
    description: meta.description,
    area: meta.area,
    state: meta.state,
    viewport: viewport ? `${viewport.width}x${viewport.height}` : "unknown",
    bugs: meta.bugs ?? [],
  };

  const manifestPath = path.join(groupDir, "manifest.json");
  let existing: ShotRecord[] = [];
  try {
    existing = JSON.parse(await readFile(manifestPath, "utf8")) as ShotRecord[];
    if (!Array.isArray(existing)) existing = [];
  } catch {
    existing = [];
  }
  const next = existing.filter((r) => r.file !== file);
  next.push(record);
  await writeFile(manifestPath, JSON.stringify(next, null, 2) + "\n", "utf8");
  return record;
}
