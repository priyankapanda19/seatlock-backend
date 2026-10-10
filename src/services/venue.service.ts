import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";

export const createVenue = async (data: {
  name: string;
  address: string;
  city: string;
  capacity: number;
}) => {
  const venue = await prisma.venue.create({
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      capacity: data.capacity,
    },
  });

  return venue;
};

export const getVenues = async () => {
  const venues = await prisma.venue.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return venues;
};

export const getVenueById = async (
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
      404,
      "Venue not found"
    );
  }

  return venue;
};

export const updateVenue = async (
  venueId: string,
  data: {
    name?: string;
    address?: string;
    city?: string;
    capacity?: number;
  }
) => {
  const existingVenue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!existingVenue) {
    throw new Error("Venue not found");
  }

  const venue = await prisma.venue.update({
    where: {
      id: venueId,
    },
    data,
  });

  return venue;
};

export const updateVenueStatus = async (
  venueId: string,
  isActive: boolean
) => {
  const existingVenue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!existingVenue) {
    throw new Error("Venue not found");
  }

  const venue = await prisma.venue.update({
    where: {
      id: venueId,
    },
    data: {
      isActive,
    },
  });

  return venue;
};