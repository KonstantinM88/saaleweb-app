import { Link } from "@/i18n/navigation";
import type { PostListItem } from "@/entities/blog/api";

export function PostCard({ post, locale }: { post: PostListItem; locale: string }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift"
    >
      <div className="relative h-[170px] overflow-hidden bg-brand">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <span className="mb-2.5 w-fit rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] font-semibold text-brand-purple">
            {post.category.name}
          </span>
        )}
        <h3 className="mb-2 text-lg font-bold leading-snug text-dark">{post.title}</h3>
        {post.excerpt && (
          <p className="line-clamp-3 text-sm text-muted">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-4 text-[12.5px] text-muted">
          {date && <span>{date}</span>}
          {date && <span className="text-line">·</span>}
          <span>{post.readingTime} min</span>
        </div>
      </div>
    </Link>
  );
}
