import { Router } from "express";

import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  updateVenueStatus,
} from "../controllers/venue.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  createVenue
);

router.get(
  "/",
  authenticate,
  getVenues
);

router.get(
  "/:venueId",
  authenticate,
  getVenueById
);

router.patch(
  "/:venueId",
  authenticate,
  requireRole("ADMIN"),
  updateVenue
);

router.patch(
  "/:venueId/status",
  authenticate,
  requireRole("ADMIN"),
  updateVenueStatus
);

export default router;