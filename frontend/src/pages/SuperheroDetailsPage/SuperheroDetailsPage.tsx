import styles from "./SuperheroDetailsPage.module.css"
import {useNavigate, useParams} from "react-router-dom";
import {useDeleteSuperheroMutation, useGetSuperheroQuery} from "../../store/superheroApi.ts";
import {useMemo} from "react";

export const SuperheroDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const heroId = id ?? "";
    const {data: hero, isLoading, error} = useGetSuperheroQuery(heroId, {
        skip: !heroId,
    });

    const [deleteHero, deleteState] = useDeleteSuperheroMutation();

    const gallery = useMemo(() => {
        if (!hero?.images?.length) return [];
        const mainId = hero.mainImage?.id;
        return mainId ? hero.images.filter((img) => img.id !== mainId) : hero.images;
    }, [hero]);

    const onDelete = async () => {
        if (!heroId) return;
        const ok = window.confirm("Delete this superhero?");
        if (!ok) return;

        try {
            await deleteHero(heroId).unwrap();
            navigate("/superheroes");
        } catch (e) {
            console.error(e);
        }
    };

    if (!heroId) {
        return (
            <main className={styles.page}>
                <p>Missing hero id.</p>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className={styles.page}>
                <p>Loading...</p>
            </main>
        );
    }

    if (error || !hero) {
        return (
            <main className={styles.page}>
                <p>Failed to load superhero.</p>
                <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>
                    Back
                </button>
            </main>
        );
    }

    return (
        <main className={styles["details"]}>
            <section className={styles["details-top"]}>
                {hero.mainImage?.url ? (
                    <div className={styles["details-ImageBox"]}>
                        <img
                            src={`http://localhost:3000${hero.mainImage.url}`}
                            alt={`${hero.nickname} main`}
                            className={styles["details-image"]}
                        />
                    </div>
                ) : (
                    <div className={styles["details-no-photo"]}>No main image</div>
                )}
                <div className={styles["details-info-card"]}>
                    <dl>
                        <dt>Nickname</dt>
                        <dd>{hero.nickname}</dd>

                        <dt>Real name</dt>
                        <dd>{hero.real_name}</dd>

                        <dt>Origin</dt>
                        <dd>{hero.origin_description}</dd>

                        <dt>Catch phrase</dt>
                        <dd>{hero.catch_phrase}</dd>

                        <dt>Superpowers</dt>
                        <dd>{hero.superpowers.map((p, idx) => (
                            <li key={`${p}-${idx}`} className={styles.pill}>
                                {p}
                            </li>
                        ))}</dd>
                    </dl>
                </div>
            </section>
            <section className={styles["details-bottom"]}>
                <div className={styles["details-card"]}>
                    <p className={styles["details-section-gallery"]}>Gallery</p>
                    {gallery.length ? (
                        <div className={styles["details-gallery"]}>
                            {gallery.map((img) => (
                                <div key={img.id} className={styles["details-thumb"]}>
                                    <img
                                        src={`http://localhost:3000${img.url}`}
                                        alt={`${hero.nickname} ${img.id}`}
                                        className={styles["details-thumb-img"]}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles["details-muted"]}>No gallery images</p>
                    )}
                </div>
            </section>

            <div className={styles["details-actions"]}>
                <button onClick={() => navigate(`/superheroes/${hero.id}/edit`)}>
                    Edit
                </button>

                <button className={styles["details-danger-btn"]} onClick={onDelete} disabled={deleteState.isLoading}>
                    {deleteState.isLoading ? "Deleting…" : "Delete"}
                </button>
            </div>
        </main>
    );
};