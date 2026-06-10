import { routing } from "@/i18n/routing";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { PostForm, type PostDefaults } from "@/widgets/admin/PostForm";
import { createPost } from "@/features/admin/blog/actions";
import { getCategoryOptions, getAuthorOptions } from "@/features/admin/blog/data";

export const dynamic = "force-dynamic";

const emptyDefaults: PostDefaults = {
  coverImage: "",
  readingTime: "",
  published: false,
  publishedAt: "",
  categoryId: "",
  authorId: "",
  translations: Object.fromEntries(
    routing.locales.map((l) => [l, { title: "", slug: "", excerpt: "", content: "" }]),
  ),
};

export default async function NewPostPage() {
  const [categories, authors] = await Promise.all([getCategoryOptions(), getAuthorOptions()]);
  return (
    <>
      <PageHeader title="Neuer Artikel" />
      <PostForm
        action={createPost}
        defaults={emptyDefaults}
        categories={categories}
        authors={authors}
        submitLabel="Erstellen"
      />
    </>
  );
}
