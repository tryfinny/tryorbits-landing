import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export interface BlogPostPreview {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

export function LatestBlogSection({ posts }: { posts: BlogPostPreview[] }) {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  if (posts.length === 0) return null;

  return (
    <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-10 lg:mb-14"
        >
          <motion.span
            className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            Latest from our blog
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            Tips for a calmer home
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View all posts
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function BlogCard({ post, index }: { post: BlogPostPreview; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        delay: index * 0.08,
      }}
      className="group"
    >
      <a
        href={`/blog/${post.slug}`}
        className="block h-full border border-border/40 rounded-2xl p-6 glass transition-colors hover:border-primary/20"
      >
        <time className="text-sm text-muted-foreground">{formattedDate}</time>
        <h3 className="text-lg font-serif font-medium mt-2 mb-3 group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </a>
    </motion.article>
  );
}
