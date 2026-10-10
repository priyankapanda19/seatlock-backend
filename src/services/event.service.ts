import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";

import {
  findEventById,
  ensureEventExists,
  ensureVenueExistsAndActive,
} from "../utils/event.helper";

export const createEvent = async (data: {
  venueId: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}) => {
  await ensureVenueExistsAndActive(
    data.venueId
  );

  if (data.endTime <= data.startTime) {
    throw new AppError(
      400,
      "End time must be after start time"
    );
  }

  return prisma.event.create({
    data: {
      venueId: data.venueId,
      name: data.name,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
};

export const getEvents = async () => {
  return prisma.event.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },

    include: {
      venue: true,
    },

    orderBy: {
      startTime: "asc",
    },
  });
};

export const getEventById = async (
  eventId: string
) => {
  const event = await findEventById(
    eventId
  );

  return prisma.event.findUnique({
    where: {
      id: event.id,
    },

    include: {
      venue: true,
    },
  });
};

export const updateEvent = async (
  eventId: string,
  data: {
    name?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
  }
) => {
  const event = await ensureEventExists(
    eventId
  );

  const startTime =
    data.startTime ?? event.startTime;

  const endTime =
    data.endTime ?? event.endTime;

  if (endTime <= startTime) {
    throw new AppError(
      400,
      "End time must be after start time"
    );
  }

  if (
    event.status === "CANCELLED" ||
    event.status === "COMPLETED"
  ) {
    throw new AppError(
      400,
      "Cannot update a cancelled or completed event"
    );
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },

    data,
  });
};

export const updateEventStatus = async (
  eventId: string,
  status:
    | "UPCOMING"
    | "OPEN"
    | "SOLD_OUT"
    | "CANCELLED"
    | "COMPLETED"
) => {
  const event = await ensureEventExists(
    eventId
  );

  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Cancelled event cannot change status"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Completed event cannot change status"
    );
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },

    data: {
      status,
    },
  });
};

export const cancelEvent = async (
  eventId: string
) => {
  const event = await ensureEventExists(
    eventId
  );

  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Event is already cancelled"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Completed event cannot be cancelled"
    );
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },

    data: {
      status: "CANCELLED",
    },
  });
};