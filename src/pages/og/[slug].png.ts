import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const fontRegular = fs.readFileSync(path.resolve(process.cwd(), 'src/fonts/Inter-Regular.ttf'));
const fontSemiBold = fs.readFileSync(path.resolve(process.cwd(), 'src/fonts/Inter-SemiBold.ttf'));

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title, description: post.data.description },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description: string };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          background: '#111111',
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'Inter',
        },
        children: [
          // Top: Orbits wordmark
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#ffffff',
                      fontSize: '22px',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                    },
                    children: 'Orbits',
                  },
                },
              ],
            },
          },
          // Middle: title + description
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#ffffff',
                      fontSize: title.length > 50 ? '52px' : '62px',
                      fontWeight: 600,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                      maxWidth: '960px',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#888888',
                      fontSize: '26px',
                      lineHeight: 1.4,
                      maxWidth: '840px',
                    },
                    children: description,
                  },
                },
              ],
            },
          },
          // Bottom: URL
          {
            type: 'div',
            props: {
              style: {
                color: '#555555',
                fontSize: '20px',
                letterSpacing: '0.05em',
              },
              children: 'tryorbits.com',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontSemiBold,
          weight: 600,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
