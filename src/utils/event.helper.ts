import prisma from "../lib/prisma";
import { AppError } from "./app-error";

export const findEventById = async (
  eventId: string
) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new AppError(
      404,
      "Event not found"
    );
  }

  return event;
};

export const ensureEventExists = async (
  eventId: string
) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new AppError(
      404,
      "Event not found"
    );
  }

  return event;
};

export const ensureVenueExistsAndActive = async (
  venueId: string
) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!venue) {
    throw new AppError(
      404,
      "Venue not found"
    );
  }

  if (!venue.isActive) {
    throw new AppError(
      400,
      "Cannot create event for inactive venue"
    );
  }

  return venue;
};