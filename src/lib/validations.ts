import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0').max(999999, 'Price is too high'),
  brand: z.string().min(1, 'Brand is required').max(50, 'Brand must be less than 50 characters'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative').max(9999, 'Stock is too high'),
});

export type ProductFormData = z.infer<typeof productSchema>;