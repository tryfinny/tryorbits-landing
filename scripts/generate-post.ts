#!/usr/bin/env npx tsx
/**
 * AI Blog Post Generator
 * Usage: npm run generate-post -- --topic="How to stop forgetting grocery items"
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const topic = process.argv.find((a) => a.startsWith('--topic='))?.split('=').slice(1).join('=');

if (!topic) {
  console.error('Error: --topic is required');
  console.error('Usage: npm run generate-post -- --topic="Your topic here"');
  process.exit(1);
}

const slug = topic
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .slice(0, 60);

const today = new Date().toISOString().split('T')[0];
const outPath = path.join(__dirname, '..', 'src', 'content', 'blog', `${slug}.md`);

if (fs.existsSync(outPath)) {
  console.error(`Error: file already exists at ${outPath}`);
  process.exit(1);
}

console.log(`Generating post for: "${topic}"...`);

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 2500,
  messages: [
    {
      role: 'user',
      content: `Write a 900–1100 word SEO-optimised blog post for the Orbits blog. Orbits is an AI-powered household management app (iOS/Android) that handles calendar, tasks, grocery lists, and home maintenance for busy families and couples. The app is free to download.

Topic: "${topic}"

Requirements:
- Title that naturally includes target search keywords people actually type
- Meta description under 155 characters
- Friendly, practical tone — helpful like a smart friend, not corporate
- 3–4 sections with H2 headings
- Naturally weave in Orbits where genuinely relevant (not forced or spammy)
- End with a brief CTA mentioning Orbits
- Tags: 3–5 relevant keyword tags

Return ONLY the markdown document, beginning with frontmatter exactly like this:

---
title: "..."
description: "..."
date: ${today}
tags: ["...", "..."]
---

[article content here]`,
    },
  ],
});

const content = response.content[0].type === 'text' ? response.content[0].text : '';

if (!content.startsWith('---')) {
  console.error('Unexpected response format from Claude. Raw output:');
  console.error(content.slice(0, 500));
  process.exit(1);
}

fs.writeFileSync(outPath, content, 'utf-8');
console.log(`✓ Post written to: src/content/blog/${slug}.md`);
console.log(`  → Preview at: http://localhost:4321/blog/${slug}`);
console.log(`  → Commit and push to deploy.`);
