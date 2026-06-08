import { getBlogCategories } from '@/lib/data/content'
import { BlogCategoryShell } from '@/components/content/BlogCategoryShell'

export const metadata = { title: 'Blog Categories' }

export default async function BlogCategoriesPage() {
  const categories = await getBlogCategories()
  return (
    <div className="p-5 sm:p-6 max-w-3xl mx-auto">
      <BlogCategoryShell initialCategories={categories} />
    </div>
  )
}
