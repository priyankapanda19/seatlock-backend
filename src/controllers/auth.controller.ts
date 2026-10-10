import {
    Request,
    Response,
} from "express";

import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "../services/auth.service";


//register
export async function register(
    req: Request,
    res: Response
) {
    try {
        const {
            name,
            email,
            phone,
            password,
        } = req.body;

        const user =
            await registerUser({
                name,
                email,
                phone,
                password,
            });

        return res.status(201).json({
            message:
                "User registered successfully",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Registration failed",
        });
    }
}

//login
export async function login(
    req: Request,
    res: Response
) {
    try {
        const {
            email,
            password,
        } = req.body;

        const result =
            await loginUser({
                email,
                password,
            });

        return res.status(200).json({
            message: "Login successful",
            ...result,
        });
    } catch (error) {
        return res.status(401).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Login failed",
        });
    }
}


//refresh token
export async function refresh(
    req: Request,
    res: Response
) {
    try {
        const {
            refreshToken,
        } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message:
                    "Refresh token is required",
            });
        }

        const result =
            await refreshAccessToken(
                refreshToken
            );

        return res.status(200).json(
            result
        );
    } catch (error) {
        return res.status(401).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Refresh failed",
        });
    }
}

//logout
export async function logout(
    req: Request,
    res: Response
) {
    try {
        const {
            refreshToken,
        } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message:
                    "Refresh token is required",
            });
        }

        await logoutUser(refreshToken);

        return res.status(200).json({
            message:
                "Logout successful",
        });
    } catch (error) {
        return res.status(401).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Logout failed",
        });
    }
}