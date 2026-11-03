import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { POSTS } from "@/data/content";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Article" };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="section" style={{ paddingTop: "calc(var(--nav-h) + 60px)" }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <Reveal>
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
            <Icon name="arrow" size={15} className="flip" /> All articles
          </Link>
          <p className="eyebrow">{post.category} · {post.date}</p>
          <h1 style={{ marginTop: 16, fontSize: "clamp(32px, 5vw, 54px)", color: "var(--text)" }}>{post.title}</h1>
        </Reveal>
        <div style={{ marginTop: 32, display: "grid", gap: 22 }}>
          {post.body.map((para, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className="lede" style={{ maxWidth: "unset", fontSize: 18 }}>{para}</p>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="glass" style={{ marginTop: 40, padding: 24, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>Sample article — replace with the mosque&rsquo;s own posts.</span>
            <Link href="/contact" className="btn btn-ghost">Contact the masjid</Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
