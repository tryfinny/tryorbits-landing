import { readFileSync, writeFileSync, existsSync } from "fs";
import { XMLParser } from "fast-xml-parser";

const SITEMAP_URL = "https://tryorbits.com/sitemap.xml";
const CACHE_PATH = ".github/scripts/sitemap-cache.json";
const HOST = "tryorbits.com";

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.error("Missing INDEXNOW_KEY secret");
  process.exit(1);
}

const testUrl = process.env.TEST_URL?.trim();

async function fetchSitemap() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser();
  const doc = parser.parse(xml);
  const urls = doc.urlset?.url;
  if (!urls) throw new Error("No <url> entries found in sitemap");
  const entries = Array.isArray(urls) ? urls : [urls];
  const map = {};
  for (const entry of entries) {
    map[entry.loc] = entry.lastmod ?? null;
  }
  return map;
}

function loadCache() {
  if (!existsSync(CACHE_PATH)) return null;
  return JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
}

function saveCache(map) {
  writeFileSync(CACHE_PATH, JSON.stringify(map, null, 2));
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.status;
  } catch {
    return 0;
  }
}

async function submitToIndexNow(urls) {
  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow accepted (${res.status})`);
  } else {
    console.error(`IndexNow returned ${res.status}: ${text}`);
  }
}

async function run() {
  if (testUrl) {
    console.log(`Manual test mode — submitting: ${testUrl}`);
    const status = await checkUrl(testUrl);
    if (status !== 200) {
      console.error(`URL returned ${status}, skipping`);
      return;
    }
    await submitToIndexNow([testUrl]);
    return;
  }

  const current = await fetchSitemap();
  const totalUrls = Object.keys(current).length;
  console.log(`Sitemap: ${totalUrls} URLs`);

  const cached = loadCache();

  if (!cached) {
    console.log("First run — caching sitemap without submitting");
    saveCache(current);
    return;
  }

  const cachedCount = Object.keys(cached).length;
  console.log(`Cached: ${cachedCount} URLs`);

  const changed = [];
  for (const [url, lastmod] of Object.entries(current)) {
    if (!(url in cached)) {
      console.log(`  NEW: ${url}`);
      changed.push(url);
    } else if (lastmod !== null && lastmod !== cached[url]) {
      console.log(`  CHANGED: ${url} (${cached[url]} → ${lastmod})`);
      changed.push(url);
    }
  }

  console.log(`Diff: ${changed.length} URL(s) to check`);

  if (changed.length === 0) {
    console.log("Nothing to submit");
    saveCache(current);
    return;
  }

  const toSubmit = [];
  let skipped = 0;
  for (const url of changed) {
    const status = await checkUrl(url);
    if (status === 200) {
      toSubmit.push(url);
    } else {
      console.warn(`  SKIP ${url} (HTTP ${status})`);
      skipped++;
    }
  }

  console.log(`Submitting: ${toSubmit.length}, Skipped: ${skipped}`);

  if (toSubmit.length > 0) {
    await submitToIndexNow(toSubmit);
  }

  saveCache(current);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
