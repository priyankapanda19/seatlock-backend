import {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    verifyAccessToken,
} from "../utils/jwt";

export interface AuthenticatedRequest
    extends Request {
    userId?: string;
    role?: "USER" | "ADMIN";
}

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message:
                "Authorization header is required",
        });
    }

    const [
        scheme,
        token,
    ] = authHeader.split(" ");

    if (
        scheme !== "Bearer" ||
        !token
    ) {
        return res.status(401).json({
            message:
                "Invalid authorization format",
        });
    }

    try {
        const payload =
            verifyAccessToken(token);

        req.userId =
            payload.userId;

        req.role =
            payload.role;

        next();
    } catch {
        return res.status(401).json({
            message:
                "Invalid or expired access token",
        });
    }
}