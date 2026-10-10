import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
}

export function generateAccessToken(
    userId: string,
    role: "USER" | "ADMIN"
): string {
    return jwt.sign(
        {
            userId,
            role,
        },
        ACCESS_SECRET,
        {
            expiresIn: "24h",
        }
    );
}

export function generateRefreshToken(
    userId: string
): string {
    return jwt.sign(
        {
            userId,
        },
        REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );
}

export function verifyAccessToken(
    token: string
): {
    userId: string;
    role: "USER" | "ADMIN";
} {
    return jwt.verify(
        token,
        ACCESS_SECRET
    ) as {
        userId: string;
        role: "USER" | "ADMIN";
    };
}

export function verifyRefreshToken(
    token: string
): { userId: string } {
    return jwt.verify(
        token,
        REFRESH_SECRET
    ) as { userId: string };
}