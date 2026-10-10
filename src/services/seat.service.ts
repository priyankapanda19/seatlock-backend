import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";
import { ensureEventExists } from "../utils/seat.helper";


import {
  ensureEventExists,
  ensureSeatExists,
} from "../utils/seat.helper";

export const createSeat = async (
  eventId: string,
  data: {
    rowNumber: string;
    seatNumber: number;
    category: string;
    price: number;
  }
) => {
  const event = await ensureEventExists(eventId);

  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Cannot create seats for a cancelled event"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Cannot create seats for a completed event"
    );
  }

  const existingSeat =
    await prisma.seat.findFirst({
      where: {
        eventId,
        rowNumber: data.rowNumber,
        seatNumber: data.seatNumber,
      },
    });

  if (existingSeat) {
    throw new AppError(
      409,
      `Seat ${data.rowNumber}${data.seatNumber} already exists for this event`
    );
  }

  return prisma.seat.create({
    data: {
      eventId,
      rowNumber: data.rowNumber,
      seatNumber: data.seatNumber,
      category: data.category,
      price: data.price,
    },
  });
};

export const getEventSeats = async (
  eventId: string
) => {
  await ensureEventExists(eventId);

  return prisma.seat.findMany({
    where: {
      eventId,
    },
    orderBy: [
      {
        rowNumber: "asc",
      },
      {
        seatNumber: "asc",
      },
    ],
  });
};

export const getAvailableSeats = async (
  eventId: string
) => {
  const event = await ensureEventExists(eventId);

  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Cannot view available seats for a cancelled event"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Cannot view available seats for a completed event"
    );
  }

  return prisma.seat.findMany({
    where: {
      eventId,
      status: "AVAILABLE",
    },
    orderBy: [
      {
        rowNumber: "asc",
      },
      {
        seatNumber: "asc",
      },
    ],
  });
};

export const getSeatById = async (
  seatId: string
) => {
  return ensureSeatExists(seatId);
};

export const updateSeat = async (
  seatId: string,
  data: {
    rowNumber?: string;
    seatNumber?: number;
    category?: string;
    price?: number;
  }
) => {
  const seat = await ensureSeatExists(seatId);

  if (seat.status === "HELD") {
    throw new AppError(
      409,
      "Cannot update a seat while it is temporarily held"
    );
  }

  if (seat.status === "BOOKED") {
    throw new AppError(
      409,
      "Cannot update a booked seat"
    );
  }

  if (seat.status === "BLOCKED") {
    throw new AppError(
      409,
      "Cannot update a blocked seat. Unblock the seat first"
    );
  }

  const event = await ensureEventExists(
    seat.eventId
  );

  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Cannot update seats for a cancelled event"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Cannot update seats for a completed event"
    );
  }

  const newRowNumber =
    data.rowNumber ?? seat.rowNumber;

  const newSeatNumber =
    data.seatNumber ?? seat.seatNumber;

  if (
    newRowNumber !== seat.rowNumber ||
    newSeatNumber !== seat.seatNumber
  ) {
    const duplicateSeat =
      await prisma.seat.findFirst({
        where: {
          eventId: seat.eventId,
          rowNumber: newRowNumber,
          seatNumber: newSeatNumber,
          NOT: {
            id: seatId,
          },
        },
      });

    if (duplicateSeat) {
      throw new AppError(
        409,
        `Seat ${newRowNumber}${newSeatNumber} already exists for this event`
      );
    }
  }

  return prisma.seat.update({
    where: {
      id: seatId,
    },
    data,
  });
};

export const blockSeat = async (
  seatId: string
) => {
  const seat = await ensureSeatExists(
    seatId
  );

  if (seat.status === "BOOKED") {
    throw new AppError(
      409,
      "Cannot block a booked seat"
    );
  }

  if (seat.status === "HELD") {
    throw new AppError(
      409,
      "Cannot block a temporarily held seat"
    );
  }

  if (seat.status === "BLOCKED") {
    throw new AppError(
      400,
      "Seat is already blocked"
    );
  }

  const event = await ensureEventExists(
    seat.eventId
  );

  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Cannot block seats for a cancelled event"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Cannot block seats for a completed event"
    );
  }

  return prisma.seat.update({
    where: {
      id: seatId,
    },
    data: {
      status: "BLOCKED",
    },
  });
};

export const unblockSeat = async (
  seatId: string
) => {
  const seat = await ensureSeatExists(
    seatId
  );

  if (seat.status !== "BLOCKED") {
    throw new AppError(
      400,
      "Seat is not blocked"
    );
  }

  const event = await ensureEventExists(
    seat.eventId
  );

  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Cannot unblock seats for a cancelled event"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Cannot unblock seats for a completed event"
    );
  }

  return prisma.seat.update({
    where: {
      id: seatId,
    },
    data: {
      status: "AVAILABLE",
    },
  });
};



//bulk seat cretion

type BulkSeatInput = {
  rowNumber: string;
  seatNumber: number;
  category: string;
  price: number;
};

export const bulkCreateSeats = async (
  eventId: string,
  seats: BulkSeatInput[]
) => {
  // 1. Check whether the event exists.
  const event = await ensureEventExists(eventId);

  // 2. Do not add seats to a finished or cancelled event.
  if (event.status === "CANCELLED") {
    throw new AppError(
      400,
      "Cannot create seats for a cancelled event"
    );
  }

  if (event.status === "COMPLETED") {
    throw new AppError(
      400,
      "Cannot create seats for a completed event"
    );
  }

  // 3. Detect duplicate seat positions in this request.
  const seatKeys = new Set<string>();

  for (const seat of seats) {
    const key = `${seat.rowNumber}:${seat.seatNumber}`;

    if (seatKeys.has(key)) {
      throw new AppError(
        409,
        `Duplicate seat ${seat.rowNumber}${seat.seatNumber} found in the request`
      );
    }

    seatKeys.add(key);
  }

  // 4. Check whether any requested seats already exist.
  const existingSeats = await prisma.seat.findMany({
    where: {
      eventId,
      OR: seats.map((seat) => ({
        rowNumber: seat.rowNumber,
        seatNumber: seat.seatNumber,
      })),
    },
    select: {
      rowNumber: true,
      seatNumber: true,
    },
  });

  if (existingSeats.length > 0) {
    const duplicates = existingSeats
      .map((seat) => `${seat.rowNumber}${seat.seatNumber}`)
      .join(", ");

    throw new AppError(
      409,
      `These seats already exist for this event: ${duplicates}`
    );
  }

  // 5. Insert the batch atomically.
  // The database unique constraint protects against concurrent requests.
  try {
    const result = await prisma.seat.createMany({
      data: seats.map((seat) => ({
        eventId,
        rowNumber: seat.rowNumber,
        seatNumber: seat.seatNumber,
        category: seat.category,
        price: seat.price,
        status: "AVAILABLE" as const,
      })),
    });

    return {
      eventId,
      createdCount: result.count,
    };
  } catch (error: unknown) {
    // Prisma unique-constraint violation.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new AppError(
        409,
        "One or more seats already exist for this event. No seats were created."
      );
    }

    throw error;
  }
};