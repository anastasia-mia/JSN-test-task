import styles from "./Footer.module.css";

export const Footer = () => {

    return(
        <footer className={styles["footer"]}>
            <div className="container">
                <div className={styles["footer-container"]}>
                    <p>Anastasiia Turchyn 2026</p>
                    <p>JSN test task</p>
                </div>
            </div>
        </footer>
    )
}