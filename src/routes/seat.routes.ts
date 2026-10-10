import { Router } from "express";

import {
  createSeat,
  getEventSeats,
  getAvailableSeats,
  getSeatById,
  updateSeat,
  blockSeat,
  unblockSeat,bulkCreateSeats
} from "../controllers/seat.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/events/:eventId/seats",
  authenticate,
  requireRole("ADMIN"),
  createSeat
);

//bulk creation
router.post(
  "/events/:eventId/seats/bulk",
  authenticate,
  requireRole("ADMIN"),
  bulkCreateSeats
);

router.get(
  "/events/:eventId/seats",
  authenticate,
  getEventSeats
);

router.get(
  "/events/:eventId/seats/available",
  authenticate,
  getAvailableSeats
);

router.get(
  "/events/:eventId/seats/:seatId",
  authenticate,
  getSeatById
);

router.patch(
  "/seats/:seatId",
  authenticate,
  requireRole("ADMIN"),
  updateSeat
);

router.post(
  "/seats/:seatId/block",
  authenticate,
  requireRole("ADMIN"),
  blockSeat
);

router.post(
  "/seats/:seatId/unblock",
  authenticate,
  requireRole("ADMIN"),
  unblockSeat
);

export default router;