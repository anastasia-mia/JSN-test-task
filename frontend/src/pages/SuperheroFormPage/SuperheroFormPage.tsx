import { useNavigate, useParams } from "react-router-dom";
import styles from "./SuperheroFormPage.module.css";
import {
    useCreateSuperheroMutation,
    useGetSuperheroQuery,
    useUpdateSuperheroMutation,
    useUploadMainImageMutation,
    useUploadImagesMutation
} from "../../store/superheroApi.ts";
import {useEffect, useMemo, useState} from "react";
import {SuperpowersInput} from "../../components/SuperpowersInput/SuperpowersInput.tsx";
import {UploadImages} from "../../components/UploadImages/UploadImages.tsx";

type Mode = "create" | "edit";

type FormState = {
    nickname: string;
    real_name: string;
    origin_description: string;
    catch_phrase: string;
    superpowers: string[];
};

const emptyForm: FormState = {
    nickname: "",
    real_name: "",
    origin_description: "",
    catch_phrase: "",
    superpowers: [],
};

export const SuperheroFormPage = ({mode}: {mode: Mode}) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = mode === "edit";
    const heroId = id ?? "";

    const { data: hero } = useGetSuperheroQuery(heroId, {
        skip: !isEdit || !heroId,
    });

    const [createHero, createState] = useCreateSuperheroMutation();
    const [updateHero, updateState] = useUpdateSuperheroMutation();

    const [mainFile, setMainFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    const [uploadMainImage, uploadMainState] = useUploadMainImageMutation();
    const [uploadGallery, uploadGalleryState] = useUploadImagesMutation();

    const isSaving =
        createState.isLoading ||
        updateState.isLoading ||
        uploadMainState.isLoading ||
        uploadGalleryState.isLoading;

    const [form, setForm] = useState<FormState>(emptyForm);

    useEffect(() => {
        if (isEdit && hero) {
            setForm({
                nickname: hero.nickname ?? "",
                real_name: hero.real_name ?? "",
                origin_description: hero.origin_description ?? "",
                catch_phrase: hero.catch_phrase ?? "",
                superpowers: hero.superpowers ?? [],
            });
        }
    }, [isEdit, hero]);

    const canSubmit = useMemo(() => {
        return (
            form.nickname.trim().length > 0 &&
            form.real_name.trim().length > 0 &&
            form.origin_description.trim().length > 0 &&
            form.catch_phrase.trim().length > 0 &&
            form.superpowers.length > 0 &&
            form.superpowers.every((s) => s.trim().length > 0)
        );
    }, [
        form.nickname,
        form.real_name,
        form.origin_description,
        form.catch_phrase,
        form.superpowers,
    ]);

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nickname: form.nickname.trim(),
            real_name: form.real_name.trim(),
            origin_description: form.origin_description.trim(),
            catch_phrase: form.catch_phrase.trim(),
            superpowers: form.superpowers,
        };

        try {
            let idToUse = heroId;

            if (!isEdit) {
                const created = await createHero(payload).unwrap();
                idToUse = String(created.id);
            } else {
                await updateHero({ id: heroId, body: payload }).unwrap();
            }

            if (mainFile) {
                await uploadMainImage({ id: idToUse, file: mainFile }).unwrap();
                setMainFile(null);
            }

            if (galleryFiles.length > 0) {
                await uploadGallery({ id: idToUse, files: galleryFiles }).unwrap();
                setGalleryFiles([]);
            }

            navigate(`/superheroes/${idToUse}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <main className={styles.page}>
                <div className={styles["form-header"]}>
                    <h2>{isEdit ? "Edit superhero" : "Add new superhero"}</h2>
                </div>
                <form id="hero-form" className={styles["form"]} onSubmit={onSubmit}>
                    <section className={styles["form-section"]}>
                        <label className={styles["form-field"]}>
                            <span>Nickname *</span>
                            <input
                                value={form.nickname}
                                onChange={(e) => setField("nickname", e.target.value)}
                                placeholder="Superman"
                            />
                        </label>
                        <label className={styles["form-field"]}>
                            <span>Real name *</span>
                            <input
                                value={form.real_name}
                                onChange={(e) => setField("real_name", e.target.value)}
                                placeholder="Clark Kent"
                            />
                        </label>
                        <label className={styles["form-field"]}>
                            <span>Origin description *</span>
                            <textarea
                                value={form.origin_description}
                                onChange={(e) => setField("origin_description", e.target.value)}
                                placeholder="Born on Krypton..."
                                rows={4}
                            />
                        </label>
                        <label className={styles["form-field"]}>
                            <span>Catch phrase *</span>
                            <input
                                value={form.catch_phrase}
                                onChange={(e) => setField("catch_phrase", e.target.value)}
                                placeholder='“Look, up in the sky…”'
                            />
                        </label>
                        <div className={styles["form-field"]}>
                            <span>Superpowers *</span>
                            <SuperpowersInput
                                value={form.superpowers}
                                onChange={(next) => setField("superpowers", next)}
                            />
                        </div>
                        <div className={styles["form-actions"]}>
                            <button type="button" onClick={() => navigate(-1)} className={styles.secondaryBtn}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="hero-form"
                                disabled={!canSubmit || isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </section>
                    <section>
                        <UploadImages
                            mainFile={mainFile}
                            galleryFiles={galleryFiles}
                            onMainChange={setMainFile}
                            onGalleryChange={setGalleryFiles}
                        />
                    </section>

                </form>
            </main>
        </>
    )
}