// import sprite from '../../assets/sprite.svg';
import styles from "./UploadImages.module.css";
import {useMemo, useRef} from "react";
import {useObjectUrl} from "../../helpers/useObjectUrl.ts";
import {useObjectUrls} from "../../helpers/useObjectUrls.ts";

type Props = {
    mainFile: File | null;
    galleryFiles: File[];
    onMainChange: (file: File | null) => void;
    onGalleryChange: (files: File[]) => void;
};

export const UploadImages = (
    {
        mainFile,
        galleryFiles,
        onMainChange,
        onGalleryChange
    }: Props
) => {
    const mainInputRef = useRef<HTMLInputElement | null>(null);
    const galleryInputRef = useRef<HTMLInputElement | null>(null);

    const mainPreview = useObjectUrl(mainFile);
    const galleryPreviews = useObjectUrls(galleryFiles);

    const openMainPicker = () => mainInputRef.current?.click();
    const openGalleryPicker = () => galleryInputRef.current?.click();

    const onPickMain: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0] ?? null;
        onMainChange(file);
        e.target.value = "";
    };

    const onPickGallery: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const key = (f: File) => `${f.name}_${f.size}_${f.lastModified}`;
        const existing = new Set(galleryFiles.map(key));
        const toAdd = files.filter((f) => !existing.has(key(f)));

        onGalleryChange([...galleryFiles, ...toAdd]);
        e.target.value = "";
    };

    const removeGalleryFile = (fileKey: string) => {
        const key = (f: File) => `${f.name}_${f.size}_${f.lastModified}`;
        onGalleryChange(galleryFiles.filter((f) => key(f) !== fileKey));
    };

    const galleryItems = useMemo(() => {
        return galleryFiles.map((f) => {
            const k = `${f.name}_${f.size}_${f.lastModified}`;
            return {key: k, file: f, preview: galleryPreviews![k]};
        });
    }, [galleryFiles, galleryPreviews]);


    return (
        <div className={styles["images"]}>
            <div className={styles["images-main"]}>
                <div className={styles["images-main-upload"]}>
                    <p>Upload main image</p>
                    <div className={styles["images-upload"]} onClick={openMainPicker}>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
                        </svg>
                        <span>Upload</span>
                        <input
                            ref={mainInputRef}
                            type="file"
                            onChange={onPickMain}
                            accept="image/*"
                        />
                    </div>

                </div>
                {mainPreview &&
                    <img src={mainPreview!}
                         className={styles["images-main-image"]}
                         alt="Main superhero Image"
                    />
                }
                <div/>
            </div>
            <div className={styles["images-gallery"]}>
                <div className={styles["images-gallery-upload"]} onClick={openGalleryPicker}>
                    <p>Upload other images</p>
                    <div className={styles["images-upload"]}>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                             viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
                        </svg>
                        <span>Upload</span>
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onPickGallery}
                        />
                    </div>
                </div>
                <div className={styles["images-gallery-list"]}>
                    {galleryItems.map((it) => (
                        <div key={it.key} className={styles["images-thumb"]}>
                            {it.preview ? (
                                <img src={it.preview} alt={it.file.name}/>
                            ) : (
                                <div className={styles["images-thumb-placeholder"]}/>
                            )}

                            <span
                                onClick={() => removeGalleryFile(it.key)}
                                aria-label={`Remove ${it.file.name}`}
                            >
                             ×
                        </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}