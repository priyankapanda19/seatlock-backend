import {
    Response,
    NextFunction,
} from "express";

import {
    AuthenticatedRequest,
} from "./auth.middleware";

export const requireRole = (
    role: "USER" | "ADMIN"
) => {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (req.role !== role) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        next();
    };
};