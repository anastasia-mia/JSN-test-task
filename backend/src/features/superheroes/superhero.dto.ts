import { z } from "zod";

export const CreateSuperheroSchema = z.object({
    nickname: z.string().trim().min(1, "nickname is required"),
    real_name: z.string().trim().min(1, "real_name is required"),
    origin_description: z.string().trim().min(1, "origin_description is required"),
    superpowers: z.array(z.string().trim().min(1, "superpower cannot be empty"))
        .min(1, "superpowers must have at list one item"),
    catch_phrase: z.string().trim().min(1, "catch_phrase is required")
})

export const UpdateSuperheroSchema = z.object({
    nickname: z.string().trim().min(1, "nickname cannot be empty").optional(),
    real_name: z.string().trim().min(1, "real_name cannot be empty").optional(),
    origin_description: z.string().trim().min(1, "origin_description cannot be empty").optional(),
    superpowers: z.array(z.string().trim().min(1, "superpower cannot be empty"))
        .min(1, "superpowers must have at least one item").optional(),
    catch_phrase: z.string().trim().min(1, "catch_phrase cannot be empty").optional()
})

export const ListSuperheroesQuerySchema = z
    .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(5),
    })
    .strict();

export const SetMainSchema = z.object({
    imageId: z.coerce.number().int().nullable(),
});

export type CreateSuperheroDto = z.infer<typeof CreateSuperheroSchema>
export type UpdateSuperheroDto = z.infer<typeof UpdateSuperheroSchema>
export type ListSuperheroesQueryDto = z.infer<typeof ListSuperheroesQuerySchema>;