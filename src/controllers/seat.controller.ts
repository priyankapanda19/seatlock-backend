import {
  Request,
  Response,
  NextFunction
} from "express";


import * as seatService from "../services/seat.service";
import { bulkCreateSeatsSchema } from "../validators/seat.validator";

export const createSeat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const seat = await seatService.createSeat(
      eventId,
      req.body
    );

    return res.status(201).json({
      message: "Seat created successfully",
      data: seat,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventSeats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const seats =
      await seatService.getEventSeats(
        eventId
      );

    return res.status(200).json({
      message: "Seats fetched successfully",
      data: seats,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSeats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const seats =
      await seatService.getAvailableSeats(
        eventId
      );

    return res.status(200).json({
      message:
        "Available seats fetched successfully",
      data: seats,
    });
  } catch (error) {
    next(error);
  }
};

export const getSeatById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seatId } = req.params;

    const seat =
      await seatService.getSeatById(
        seatId
      );

    return res.status(200).json({
      message: "Seat fetched successfully",
      data: seat,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSeat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seatId } = req.params;

    const seat =
      await seatService.updateSeat(
        seatId,
        req.body
      );

    return res.status(200).json({
      message: "Seat updated successfully",
      data: seat,
    });
  } catch (error) {
    next(error);
  }
};

export const blockSeat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seatId } = req.params;

    const seat =
      await seatService.blockSeat(
        seatId
      );

    return res.status(200).json({
      message: "Seat blocked successfully",
      data: seat,
    });
  } catch (error) {
    next(error);
  }
};

export const unblockSeat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seatId } = req.params;

    const seat =
      await seatService.unblockSeat(
        seatId
      );

    return res.status(200).json({
      message: "Seat unblocked successfully",
      data: seat,
    });
  } catch (error) {
    next(error);
  }
};

//bulk creation

export const bulkCreateSeats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    // Validate the entire request before calling the service.
    const validation = bulkCreateSeatsSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid seat data",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const result = await seatService.bulkCreateSeats(
      eventId,
      validation.data.seats
    );

    return res.status(201).json({
      message: "Seats created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};