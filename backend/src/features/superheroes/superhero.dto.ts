import { z } from "zod";

export const CreateSuperheroSchema = z.object({
    nickname: z.string().trim().min(1, "nickname is required"),
    real_name: z.string().trim().min(1, "real_name is required"),
    origin_description: z.string().trim().min(1, "origin_description is required"),
    superpowers: z.array(z.string().trim().min(1, "superpower cannot be empty"))
        .min(1, "superpowers must have at list one item"),
    catch_phrase: z.string().trim().min(1, "catch_phrase is required")
})

export type CreateSuperheroDto = z.infer<typeof CreateSuperheroSchema>