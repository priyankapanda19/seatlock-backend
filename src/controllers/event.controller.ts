import {
  Request,
  Response,
  NextFunction,
} from "express";

import * as eventService from "../services/event.service";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event =
      await eventService.createEvent(req.body);

    return res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events =
      await eventService.getEvents();

    return res.status(200).json({
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const event =
      await eventService.getEventById(
        eventId
      );

    return res.status(200).json({
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const event =
      await eventService.updateEvent(
        eventId,
        req.body
      );

    return res.status(200).json({
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const { status } = req.body;

    const event =
      await eventService.updateEventStatus(
        eventId,
        status
      );

    return res.status(200).json({
      message: "Event status updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    await eventService.cancelEvent(eventId);

    return res.status(200).json({
      message: "Event cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};