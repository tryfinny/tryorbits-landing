# Generate Blog Post

Generate an SEO-optimized blog post for the Orbits blog and save it to `src/content/blog/`.

## Input

The user will provide a topic or title. If only a topic is given, craft a compelling title that naturally includes target keywords.

## Requirements

### Frontmatter (YAML)

```yaml
---
title: "Title Here — naturally include primary keywords"
description: "155 characters max. Compelling meta description with keywords for SERP click-through."
date: YYYY-MM-DD  # Use today's date unless the user specifies otherwise
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]  # 4-6 relevant tags for filtering and SEO
---
```

### Content Structure

1. **Opening paragraph** — Hook the reader with a relatable scenario or surprising fact. No generic intros. Make it specific and vivid.
2. **3-5 H2 sections** — Each section should be substantive (150-250 words). Use descriptive H2 headings that include secondary keywords where natural.
3. **Orbits mention** — Naturally reference Orbits in ONE section (not the intro, not the conclusion). Frame it as a solution to the problem being discussed, not a sales pitch. Match the tone of existing posts — informative, not promotional.
4. **No explicit CTA conclusion** — The last section should wrap up the ideas naturally. The blog page already has a `<BlogCTA />` component that renders below the article.

### Writing Style (match existing posts exactly)

- **Tone**: Conversational but authoritative. Like explaining something to a smart friend.
- **Voice**: Second person ("you") and first person plural ("most families", "we").
- **Sentences**: Mix short punchy sentences with longer explanatory ones. Use em dashes liberally.
- **Paragraphs**: 2-4 sentences each. Never walls of text.
- **Bold text**: Use `**bold**` for key phrases within paragraphs (1-2 per section max).
- **Lists**: Use sparingly and only when listing 3+ parallel items. Prefer prose.
- **Word count**: 900-1200 words total.
- **No fluff**: Every sentence should earn its place. Cut filler words, hedging language, and throat-clearing.

### SEO Specifics

- **Slug**: Derived from title. Lowercase, hyphens, no stop words where possible. Max 60 chars.
- **Title**: 50-65 characters ideal for SERP display. Include primary keyword near the front.
- **Description**: 120-155 characters. Include primary keyword. Make it compelling enough to click.
- **Tags**: Use existing tags where possible to build topic clusters. Check existing posts for tag reuse.
- **H2 headings**: Include secondary/related keywords naturally.
- **Internal context**: The post will automatically get:
  - Unique OG image (1200x630 PNG generated from title + description at build time)
  - JSON-LD BlogPosting schema with datePublished, dateModified, author, publisher
  - Canonical URL at `https://tryorbits.com/blog/{slug}`
  - Reading time calculated from word count
  - Related posts shown below the article
  - RSS feed inclusion

### What Orbits Is (for context)

Orbits is a household management app (iOS + Android) that uses AI to help families coordinate their home life. Key features:
- Family calendar (syncs with Google Calendar and Outlook)
- Shared grocery and shopping lists
- Home upkeep tracking (appliances, maintenance schedules, warranties)
- Service request coordination (find providers, get quotes, track repairs)
- Email intelligence (auto-extracts household-relevant info from inbox)
- AI that works in the background — not a chatbot, but proactive automation

Target audience: busy families, couples managing a household, homeowners.

### Existing Tags (reuse when relevant)

- household management, family organization, productivity, home management apps
- mental load, cognitive labor, relationship
- meal planning, grocery list, family meals, weekly planning
- home maintenance, homeowner tips, house upkeep, seasonal maintenance, home management
- family communication, group chat

## Output

1. Write the markdown file to `src/content/blog/{slug}.md`
2. Confirm the file was created with the title, slug, date, and word count
3. Do NOT commit — the user will decide when to commit

## Topic

$ARGUMENTS
