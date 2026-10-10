import express from "express";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";
import { errorHandler } from "./middleware/error.middleware";
import eventRoutes from "./routes/event.routes";
import seatRoutes from "./routes/seat.routes";




const app = express();

app.use(express.json());

app.get(
    "/health",
    (req, res) => {
        res.status(200).json({
            message:
                "SeatLock API is running ...................",
        });
    }
);

app.use(
  "/api/v1",
  seatRoutes
);


app.use(
  "/api/v1/events",
  eventRoutes
);

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/users",
    userRoutes
);

app.use("/api/v1/venues", venueRoutes);

app.use(errorHandler);

export default app;