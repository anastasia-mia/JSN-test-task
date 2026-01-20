import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export type ImageDto = { id: number; url: string };

export type Superhero = {
    id: string;
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string[];
    catch_phrase: string;
    main_image_id: string | null;
    images: ImageDto[];
    mainImage: ImageDto;
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
        getSuperheroes: builder.query<Paginated<Superhero>, { page: number, limit: number }>({
            query: ({page, limit}) => `/superheroes?page=${page}&limit=${limit}`,
            providesTags: (result) => {
                if (!result) {
                    return [{type: "SuperheroList" as const, id: "PAGE"}];
                }

                return [
                    {type: "SuperheroList" as const, id: "PAGE"},
                    ...result.items.map((h) => ({type: "Superhero" as const, id: h.id})),
                ];
            }
        }),

        getSuperhero: builder.query<Superhero, string>({
            query: (id) => `/superheroes/${id}`,
            providesTags: (_res, _err, id) => [{type: "Superhero", id}],
        }),

        createSuperhero: builder.mutation<Superhero, Partial<Superhero>>({
            query: (body) => ({
                url: `/superheroes`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{type: "SuperheroList", id: "PAGE"}],
        }),

        updateSuperhero: builder.mutation<Superhero, { id: string; body: Partial<Superhero> }>({
            query: ({id, body}) => ({
                url: `/superheroes/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_res, _err, arg) => [
                {type: "Superhero", id: arg.id},
                {type: "SuperheroList", id: "PAGE"},
            ],
        }),

        deleteSuperhero: builder.mutation<{ ok: true }, string>({
            query: (id) => ({
                url: `/superheroes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "SuperheroList", id: "PAGE"}],
        }),
        uploadImages: builder.mutation({
            query: ({id, files}) => {
                const fd = new FormData();
                files.forEach(f => fd.append("images", f));

                return {
                    url: `/superheroes/${id}/images`,
                    method: "POST",
                    body: fd,
                };
            },
            invalidatesTags: (_r, _e, {id}) => [{type: "Superhero", id}],
        }),
        uploadMainImage: builder.mutation<Superhero, { id: string; file: File }>({
            query: ({id, file}) => {
                const fd = new FormData();
                fd.append("image", file);
                return {
                    url: `/superheroes/${id}/main-image`,
                    method: "POST",
                    body: fd,
                };
            },
            invalidatesTags: (_r, _e, arg) => [{type: "Superhero", id: arg.id}],
        }),

        deleteHeroImage: builder.mutation<
            { ok: true },
            { heroId: string; imageId: number }
        >({
            query: ({heroId, imageId}) => ({
                url: `/superheroes/${heroId}/images/${imageId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_r, _e, arg) => [{type: "Superhero", id: arg.heroId}],
        }),
    })
})

export const {
    useGetSuperheroesQuery,
    useGetSuperheroQuery,
    useCreateSuperheroMutation,
    useUpdateSuperheroMutation,
    useDeleteSuperheroMutation,
    useUploadImagesMutation,
    useUploadMainImageMutation,
    useDeleteHeroImageMutation,
} = superheroesApi;