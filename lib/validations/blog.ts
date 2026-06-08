import { z } from 'zod'

export const BlogPostSchema = z.object({
  title:           z.string().min(1, 'Title is required').max(300),
  categoryId:      z.string().min(1, 'Please select a category'),
  author:          z.string().min(1, 'Author is required').max(150),
  status:          z.enum(['published', 'draft']),
  excerpt:         z.string().max(500).optional(),
  content:         z.string().optional(),
  coverImageUrl:   z.string().optional(),
  tags:            z.array(z.string()).optional(),
  metaTitle:       z.string().max(70, 'Meta title must be 70 characters or fewer').optional(),
  metaDescription: z.string().max(180, 'Meta description must be 180 characters or fewer').optional(),
  focusKeyword:    z.string().optional(),
  ogImage:         z.string().optional(),
})

export const BlogCategorySchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
})
