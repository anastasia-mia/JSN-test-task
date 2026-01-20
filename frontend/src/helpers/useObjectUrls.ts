import {useEffect, useState} from "react";

export function useObjectUrls(files: File[]) {
    const [urls, setUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        const next: Record<string, string> = {};
        for (const f of files) {
            const key = `${f.name}_${f.size}_${f.lastModified}`;
            next[key] = URL.createObjectURL(f);
        }
        setUrls(next);

        return () => {
            Object.values(next).forEach((u) => URL.revokeObjectURL(u));
        };
    }, [files]);

    return urls;
}