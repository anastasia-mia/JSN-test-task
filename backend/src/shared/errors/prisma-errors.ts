import { Prisma } from "@prisma/client";
import { ApiError } from "./api-error";

export function handlePrismaNotFound(
    err: unknown,
    message = "Resource not found"
): never {
    if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
    ) {
        throw ApiError.notFound(message);
    }

    throw err;
}