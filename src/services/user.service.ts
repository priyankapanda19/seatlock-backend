import prisma from "../lib/prisma";

export async function getUserById(
    userId: string
) {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },

        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}