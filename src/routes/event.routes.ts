import { Router } from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
  cancelEvent,
} from "../controllers/event.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// Create event - ADMIN
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  createEvent
);

// Get all events - authenticated
router.get(
  "/",
  authenticate,
  getEvents
);

// Get event by ID - authenticated
router.get(
  "/:eventId",
  authenticate,
  getEventById
);

// Update event - ADMIN
router.patch(
  "/:eventId",
  authenticate,
  requireRole("ADMIN"),
  updateEvent
);

// Update status - ADMIN
router.patch(
  "/:eventId/status",
  authenticate,
  requireRole("ADMIN"),
  updateEventStatus
);

// Cancel event - ADMIN
router.post(
  "/:eventId/cancel",
  authenticate,
  requireRole("ADMIN"),
  cancelEvent
);

export default router;