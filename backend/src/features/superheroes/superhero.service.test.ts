import * as superheroService from "./superhero.service";
import { prisma } from "../../config/db";

jest.mock("../../config/db", () => ({
    prisma: {
        superhero: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
    },
}));

const prismaMock = prisma as unknown as {
    superhero: {
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        findUnique: jest.Mock;
    };
};

describe("superhero.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should normalize superpowers (trim + unique) before creating", async () => {
            prismaMock.superhero.create.mockResolvedValue({
                id: 1,
                nickname: "Batman",
                real_name: "Bruce Wayne",
                origin_description: "Origin",
                catch_phrase: "I am Batman",
                superpowers: ["flight", "heat vision"],
            });

            await superheroService.create({
                nickname: "Batman",
                real_name: "Bruce Wayne",
                origin_description: "Origin",
                catch_phrase: "I am Batman",
                superpowers: [" flight ", "heat vision", "flight"],
            });

            expect(prismaMock.superhero.create).toHaveBeenCalledTimes(1);

            const callArg = prismaMock.superhero.create.mock.calls[0][0];
            expect(callArg).toEqual({
                data: {
                    nickname: "Batman",
                    real_name: "Bruce Wayne",
                    origin_description: "Origin",
                    catch_phrase: "I am Batman",
                    superpowers: ["flight", "heat vision"], // нормалізовано
                },
            });
        });
    });

    describe("update", () => {
        it("should normalize superpowers and not pass undefined fields to prisma.update", async () => {
            prismaMock.superhero.update.mockResolvedValue({
                id: 10,
                nickname: "Updated",
                real_name: "Bruce Wayne",
                origin_description: "Origin",
                catch_phrase: "I am Batman",
                superpowers: ["flight", "heat vision"],
            });

            await superheroService.update(10, {
                nickname: "Updated",
                superpowers: [" flight ", "heat vision", "flight"],
            });

            expect(prismaMock.superhero.update).toHaveBeenCalledTimes(1);

            const callArg = prismaMock.superhero.update.mock.calls[0][0];
            expect(callArg.where).toEqual({ id: 10 });

            expect(callArg.data).toEqual({
                nickname: "Updated",
                superpowers: ["flight", "heat vision"],
            });

            expect(Object.values(callArg.data)).not.toContain(undefined);
        });
    });

    describe("remove", () => {
        it("should call prisma.superhero.delete with correct id", async () => {
            prismaMock.superhero.delete.mockResolvedValue({
                id: 5,
            });

            await superheroService.remove(5);

            expect(prismaMock.superhero.delete).toHaveBeenCalledTimes(1);
            expect(prismaMock.superhero.delete).toHaveBeenCalledWith({
                where: { id: 5 },
            });
        });
    });
});