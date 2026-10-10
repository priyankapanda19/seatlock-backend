import prisma from "../lib/prisma";
import { AppError } from "./app-error";

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

export const ensureSeatExists = async (
  seatId: string
) => {
  const seat = await prisma.seat.findUnique({
    where: {
      id: seatId,
    },
  });

  if (!seat) {
    throw new AppError(
      404,
      "Seat not found"
    );
  }

  return seat;
};

export const ensureSeatBelongsToEvent = async (
  seatId: string,
  eventId: string
) => {
  const seat = await prisma.seat.findUnique({
    where: {
      id: seatId,
    },
  });

  if (!seat) {
    throw new AppError(
      404,
      "Seat not found"
    );
  }

  if (seat.eventId !== eventId) {
    throw new AppError(
      400,
      "Seat does not belong to this event"
    );
  }

  return seat;
};