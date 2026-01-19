import * as superheroService from "./superhero.service";
import { prisma } from "../../config/db";
import {ApiError} from "../../shared/errors/api-error";

jest.mock("../../config/db", () => ({
    prisma: {
        superhero: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
            count: jest.fn(),
            findMany: jest.fn()
        },
        $transaction: jest.fn()
    },
}));

const prismaMock = prisma as unknown as {
    superhero: {
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        findUnique: jest.Mock;
        count: jest.Mock;
        findMany: jest.Mock;
    };
    $transaction: jest.Mock;
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
                    superpowers: ["flight", "heat vision"],
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

    describe("getById", () => {
        it("should return hero details when one exists", async () => {
            prismaMock.superhero.findUnique.mockResolvedValue({
                id: 1,
                nickname: "Batman",
                real_name: "Bruce Wayne",
                origin_description: "Origin",
                superpowers: ["intelligence"],
                catch_phrase: "I am Batman",
                createdAt: "2026-01-18T15:42:48.279Z",
                updatedAt: "2026-01-18T20:20:14.224Z",
            })

            const hero = await superheroService.getById(1);

            expect(prismaMock.superhero.findUnique).toHaveBeenCalledTimes(1);
            expect(prismaMock.superhero.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });

            expect(hero).toEqual({
                id: 1,
                nickname: "Batman",
                real_name: "Bruce Wayne",
                origin_description: "Origin",
                superpowers: ["intelligence"],
                catch_phrase: "I am Batman",
                createdAt: "2026-01-18T15:42:48.279Z",
                updatedAt: "2026-01-18T20:20:14.224Z",
            });
        })

        it("should throw 404 when hero does not exist", async() => {
            prismaMock.superhero.findUnique.mockResolvedValue(null);

            await expect(superheroService.getById(999)).rejects.toBeInstanceOf(ApiError)
            await expect(superheroService.getById(999)).rejects.toMatchObject({
                statusCode: 404,
                message: "Superhero not found"
            })

            expect(prismaMock.superhero.findUnique).toHaveBeenCalledWith({where: {id: 999}})
        })
    })

    describe("list", () => {
        it("should return paginated list", async() => {
            const page = 2;
            const limit = 5;

            prismaMock.$transaction.mockResolvedValue([
                12,
                [
                    {id: 6, nickname: "Hero6"},
                    {id: 7, nickname: "Hero7"},
                    {id: 8, nickname: "Hero8"},
                    {id: 9, nickname: "Hero9"},
                    {id: 10, nickname: "Hero10"},
                ]
            ])

            const result = await superheroService.list(page, limit);

            expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                items: [
                    {id: 6, nickname: "Hero6"},
                    {id: 7, nickname: "Hero7"},
                    {id: 8, nickname: "Hero8"},
                    {id: 9, nickname: "Hero9"},
                    {id: 10, nickname: "Hero10"}
                ],
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3
            })
        })
    })
});