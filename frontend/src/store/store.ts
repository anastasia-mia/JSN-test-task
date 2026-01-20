import { configureStore } from "@reduxjs/toolkit";
import { superheroesApi } from "./superheroApi.ts";

export const store = configureStore({
    reducer: {
        [superheroesApi.reducerPath]: superheroesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(superheroesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;