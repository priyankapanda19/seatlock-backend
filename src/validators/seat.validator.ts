import { z } from "zod";

export const createSeatSchema = z.object({
  rowNumber: z
    .string()
    .trim()
    .min(1, "Row number is required")
    .max(10, "Row number cannot exceed 10 characters"),

  seatNumber: z
    .number({
      error: "Seat number must be a number",
    })
    .int("Seat number must be an integer")
    .min(1, "Seat number must be greater than 0"),

  category: z
    .string()
    .trim()
    .min(1, "Seat category is required")
    .max(50, "Seat category cannot exceed 50 characters"),

  price: z
    .number({
      error: "Seat price must be a number",
    })
    .positive("Seat price must be greater than 0"),
});

export const updateSeatSchema = z.object({
  rowNumber: z
    .string()
    .trim()
    .min(1, "Row number cannot be empty")
    .max(10, "Row number cannot exceed 10 characters")
    .optional(),

  seatNumber: z
    .number({
      error: "Seat number must be a number",
    })
    .int("Seat number must be an integer")
    .min(1, "Seat number must be greater than 0")
    .optional(),

  category: z
    .string()
    .trim()
    .min(1, "Seat category cannot be empty")
    .max(50, "Seat category cannot exceed 50 characters")
    .optional(),

  price: z
    .number({
      error: "Seat price must be a number",
    })
    .positive("Seat price must be greater than 0")
    .optional(),
});

//bulk seat cretion
import { z } from "zod";

export const bulkCreateSeatsSchema = z.object({
  seats: z
    .array(
      z.object({
        rowNumber: z
          .string()
          .trim()
          .min(1, "Row number is required")
          .max(10, "Row number cannot exceed 10 characters"),

        seatNumber: z
          .number()
          .int("Seat number must be an integer")
          .min(1, "Seat number must be greater than 0"),

        category: z
          .string()
          .trim()
          .min(1, "Seat category is required")
          .max(50, "Seat category cannot exceed 50 characters"),

        price: z
          .number()
          .finite("Seat price must be a valid number")
          .positive("Seat price must be greater than 0")
          .max(99999999.99, "Seat price is too high"),
      })
    )
    .min(1, "At least one seat is required")
    .max(500, "You can create a maximum of 500 seats per request"),
});