import { z } from "zod";

// Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.enum(["electronics", "fashion", "home", "books", "sports"]),
  brand: z.string(),
  image: z.string(),
  images: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  inStock: z.boolean(),
  features: z.array(z.string()).optional(),
});

export type Product = z.infer<typeof productSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
  selectedColor: z.string().optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// User schema
export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
  }).optional(),
});

export type User = z.infer<typeof userSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(cartItemSchema),
  total: z.number(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  createdAt: z.string(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export type Order = z.infer<typeof orderSchema>;

// Review schema
export const reviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  userName: z.string(),
  userInitials: z.string(),
  createdAt: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;
