import styles from "./GreetingPage.module.css";
import { useNavigate } from "react-router-dom";
import superHero1 from '../../assets/superhero1.webp'
import superHero2 from '../../assets/superhero2.webp'
import superHero3 from '../../assets/superhero3.webp'

export const GreetingPage = () => {
    const navigate= useNavigate();

    return (
        <div className={styles["greeting"]}>
            <div className="wrapper">
                <div className="container">
                    <main className={styles["greeting-container"]}>
                        <h1 className={styles["greeting-title"]}>Superhero Database</h1>
                        <p className={styles["greeting-text"]}>
                            This application allows you to manage a list of superheroes, including
                            their personal details, superpowers, and images.
                        </p>
                        <button onClick={() => navigate("/superheroes")}>
                            Proceed to superheroes
                        </button>
                        <div className={styles["greeting-heroes"]}>
                            <img src={superHero1} alt="Superhero" />
                            <img src={superHero2} alt="Superhero" />
                            <img src={superHero3} alt="Superhero" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}