import {
    Response,
} from "express";

import {
    AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
    getUserById,
} from "../services/user.service";

export async function getCurrentUser(
    req: AuthenticatedRequest,
    res: Response
) {
    if (!req.userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const user =
        await getUserById(
            req.userId
        );

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    return res.status(200).json({
        user,
    });
}