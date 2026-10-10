import prisma from "../lib/prisma";

import {
    hashPassword,
    comparePassword,
    hashToken,
    compareToken,
} from "../utils/password";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt";

interface RegisterInput {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export async function registerUser(
    input: RegisterInput
) {
    const {
        name,
        email,
        phone,
        password,
    } = input;

    const existingUser =
        await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone },
                ],
            },
        });

    if (existingUser) {
        throw new Error(
            "User with this email or phone already exists"
        );
    }

    const passwordHash =
        await hashPassword(password);

    const user =
        await prisma.user.create({
            data: {
                name,
                email,
                phone,
                passwordHash,
            },
        });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
}


export async function loginUser(
    input: LoginInput
) {
    const {
        email,
        password,
    } = input;

    const user =
        await prisma.user.findUnique({
            where: {
                email,
            },
        });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    if (!user.isActive) {
        throw new Error(
            "User account is inactive"
        );
    }

    const passwordValid =
        await comparePassword(
            password,
            user.passwordHash
        );

    if (!passwordValid) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const accessToken =
      generateAccessToken(
    user.id,
    user.role
)

    const refreshToken =
        generateRefreshToken(user.id);

    const refreshTokenHash =
        await hashToken(refreshToken);

    await prisma.refreshToken.create({
        data: {
            tokenHash: refreshTokenHash,
            userId: user.id,
            expiresAt: new Date(
                Date.now() +
                7 * 24 * 60 * 60 * 1000
            ),
        },
    });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
}

//refresh token
export async function refreshAccessToken(
    refreshToken: string
) {
    let payload;

    try {
        payload =
            verifyRefreshToken(refreshToken);
    } catch {
        throw new Error(
            "Invalid or expired refresh token"
        );
    }

    const tokens =
        await prisma.refreshToken.findMany({
            where: {
                userId: payload.userId,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

    let matchingToken = null;

    for (const token of tokens) {
        const matches =
            await compareToken(
                refreshToken,
                token.tokenHash
            );

        if (matches) {
            matchingToken = token;
            break;
        }
    }

    if (!matchingToken) {
        throw new Error(
            "Invalid or revoked refresh token"
        );
    }

    const newAccessToken =
        generateAccessToken(
            payload.userId
        );

    return {
        accessToken: newAccessToken,
    };
}

//logout service
export async function logoutUser(
    refreshToken: string
) {
    let payload;

    try {
        payload =
            verifyRefreshToken(refreshToken);
    } catch {
        throw new Error(
            "Invalid refresh token"
        );
    }

    const tokens =
        await prisma.refreshToken.findMany({
            where: {
                userId: payload.userId,
                revokedAt: null,
            },
        });

    for (const token of tokens) {
        const matches =
            await compareToken(
                refreshToken,
                token.tokenHash
            );

        if (matches) {
            await prisma.refreshToken.update({
                where: {
                    id: token.id,
                },
                data: {
                    revokedAt: new Date(),
                },
            });

            return;
        }
    }

    throw new Error(
        "Refresh token not found"
    );
}