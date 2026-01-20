import styles from "./Header.module.css";
import {useNavigate} from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={styles["header"]}>
            <div className={"container"}>
                <p className={styles["header-logo"]}
                   onClick={() => navigate("/superheroes")}>
                    Superhero Database
                </p>
            </div>
        </header>
    )
}