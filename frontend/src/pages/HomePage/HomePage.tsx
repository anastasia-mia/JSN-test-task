import styles from "./HomePage.module.css";
import {type Superhero, useGetSuperheroesQuery} from "../../store/superheroApi.ts";
import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Pagination} from "../../components/Pagination/Pagination.tsx";

export const HomePage = () => {
    const navigate = useNavigate();
    const limit = 5;
    const [page, setPage] = useState<number>(1);
    const [allItems, setAllItems] = useState<Superhero[]>([]);
    const { data, isLoading, error} = useGetSuperheroesQuery({ page, limit});

    useEffect(() => {
        if (!data?.items) return;

        setAllItems((prevState) => {
            const existingIds = new Set(prevState.map((x) => x.id));
            const next = data.items.filter((x) => !existingIds.has(x.id));
            return [...prevState, ...next];
        })
    }, [data?.items]);

    const canLoadMore = useMemo(() => {
        if(!data) return false;
        return allItems.length < data.total;
    }, [data, allItems.length]);

    return (
        <main className={styles["superheroes"]}>
            <h2 className={styles["superheroes-title"]}>Your collection of superheroes</h2>
            <div className={styles["superheroes-add"]}
                 onClick={() => navigate("/superheroes/new")}
            >
                <p><span>+</span> Add new superhero</p>
            </div>
            <div className={styles["superheroes-collection"]}>
                {isLoading && <p className={styles["superheroes-loading"]}>Loading ...</p>}
                {error && <p className={styles["superheroes-error"]}>Failed to load, try to reload the page!</p>}
                {data && data.items && (
                    <ul>
                        {allItems.map((h) => (
                            <li key={h.id}
                                onClick={() => navigate(`/superheroes/${h.id}`)}
                            >
                                <div className={styles["superheroes-image"]}>
                                    {h.mainImage?.url ? (
                                        <img
                                            src={`http://localhost:3000${h.mainImage.url}`}
                                            alt={`${h.nickname} main image`}
                                            width={120}
                                            height={120}
                                        />
                                    ) : (
                                        <p>No image</p>
                                    )}
                                </div>
                                {h.nickname}
                            </li>
                        ))}
                        {canLoadMore &&
                            <li className={styles["superheroes-pagination"]}>
                                <Pagination
                                    page={page}
                                    limit={limit}
                                    total={data?.total ?? 0}
                                    onPageChange={setPage}
                                />
                            </li>
                        }
                    </ul>
                )}
            </div>
        </main>
    )
}