import { Request, Response, NextFunction } from "express";
import * as venueService from "../services/venue.service";

export const createVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const venue = await venueService.createVenue(req.body);

    return res.status(201).json({
      message: "Venue created successfully",
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

export const getVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const venues = await venueService.getVenues();

    return res.status(200).json({
      message: "Venues fetched successfully",
      data: venues,
    });
  } catch (error) {
    next(error);
  }
};

export const getVenueById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { venueId } = req.params;

    const venue = await venueService.getVenueById(venueId);

    return res.status(200).json({
      message: "Venue fetched successfully",
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { venueId } = req.params;

    const venue = await venueService.updateVenue(
      venueId,
      req.body
    );

    return res.status(200).json({
      message: "Venue updated successfully",
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVenueStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { venueId } = req.params;
    const { isActive } = req.body;

    const venue = await venueService.updateVenueStatus(
      venueId,
      isActive
    );

    return res.status(200).json({
      message: "Venue status updated successfully",
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};