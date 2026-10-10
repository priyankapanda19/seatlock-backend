import { z } from "zod";

export const createEventSchema = z.object({
  venueId: z.string().min(1, "Venue ID is required"),

  name: z
    .string()
    .min(2, "Event name must be at least 2 characters"),

  description: z
    .string()
    .optional(),

  startTime: z.coerce.date(),

  endTime: z.coerce.date(),
});

export const updateEventSchema = z.object({
  name: z
    .string()
    .min(2)
    .optional(),

  description: z
    .string()
    .optional(),

  startTime: z.coerce.date().optional(),

  endTime: z.coerce.date().optional(),
});

export const updateEventStatusSchema = z.object({
  status: z.enum([
    "UPCOMING",
    "OPEN",
    "SOLD_OUT",
    "CANCELLED",
    "COMPLETED",
  ]),
});