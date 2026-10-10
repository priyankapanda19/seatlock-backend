import { z } from "zod";

export const createVenueSchema = z.object({
  name: z.string().trim().min(2),
  address: z.string().trim().min(5),
  city: z.string().trim().min(2),
  capacity: z.number().int().positive(),
});

export const updateVenueSchema = z.object({
  name: z.string().trim().min(2).optional(),
  address: z.string().trim().min(5).optional(),
  city: z.string().trim().min(2).optional(),
  capacity: z.number().int().positive().optional(),
});

export const updateVenueStatusSchema = z.object({
  isActive: z.boolean(),
});