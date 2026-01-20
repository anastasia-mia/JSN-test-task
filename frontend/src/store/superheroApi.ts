import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Superhero = {
    id: string;
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string[];
    catch_phrase: string;
};

export type Paginated<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export const superheroesApi = createApi({
    reducerPath: "superheroesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api"
    }),
    tagTypes: ["Superhero", "SuperheroList"],
    endpoints: (builder) => ({
        getSuperheroes: builder.query<Paginated<Superhero>, {page: number, limit: number}> ({
            query: ({page, limit}) => `/superheroes?page=${page}&limit=${limit}`,
            providesTags: (result) => {
                if (!result) {
                    return [{ type: "SuperheroList" as const, id: "PAGE" }];
                }

                return [
                    { type: "SuperheroList" as const, id: "PAGE" },
                    ...result.items.map((h) => ({ type: "Superhero" as const, id: h.id })),
                ];
            }
        })
    })
})

export const {
    useGetSuperheroesQuery
} = superheroesApi;