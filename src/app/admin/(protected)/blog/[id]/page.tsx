import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { PostForm, type PostDefaults } from "@/widgets/admin/PostForm";
import { updatePost } from "@/features/admin/blog/actions";
import { getCategoryOptions, getAuthorOptions } from "@/features/admin/blog/data";

export const dynamic = "force-dynamic";

type Tr = { locale: string; title: string; slug: string; excerpt: string | null; content: string };
type Post = {
  id: string;
  coverImage: string | null;
  readingTime: number | null;
  published: boolean;
  publishedAt: Date | null;
  categoryId: string | null;
  authorId: string | null;
  translations: Tr[];
};

function dateInput(d: Date | null): string {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: Post | null = null;
  try {
    post = (await prisma.blogPost.findUnique({
      where: { id },
      include: { translations: true },
    })) as Post | null;
  } catch {
    post = null;
  }
  if (!post) notFound();

  const [categories, authors] = await Promise.all([getCategoryOptions(), getAuthorOptions()]);

  const defaults: PostDefaults = {
    coverImage: post.coverImage ?? "",
    readingTime: post.readingTime != null ? String(post.readingTime) : "",
    published: post.published,
    publishedAt: dateInput(post.publishedAt),
    categoryId: post.categoryId ?? "",
    authorId: post.authorId ?? "",
    translations: Object.fromEntries(
      routing.locales.map((l) => {
        const t = post!.translations.find((x) => x.locale === l);
        return [
          l,
          {
            title: t?.title ?? "",
            slug: t?.slug ?? "",
            excerpt: t?.excerpt ?? "",
            content: t?.content ?? "",
          },
        ];
      }),
    ),
  };

  return (
    <>
      <PageHeader title="Artikel bearbeiten" />
      <PostForm
        action={updatePost.bind(null, id)}
        defaults={defaults}
        categories={categories}
        authors={authors}
        submitLabel="Speichern"
      />
    </>
  );
}
