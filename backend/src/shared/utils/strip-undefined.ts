export function stripUndefined<T extends Record<string, any>>(obj: T) {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    ) as { [K in keyof T]: Exclude<T[K], undefined> };
}