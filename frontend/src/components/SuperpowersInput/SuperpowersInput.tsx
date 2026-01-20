import {useState} from "react";
import styles from "./SuperpowersInput.module.css";


export const SuperpowersInput = ({
                                     value,
                                     onChange,
                                 }: {
    value: string[];
    onChange: (next: string[]) => void;
}) => {
    const [input, setInput] = useState("");

    const addSuperpower = () => {
        const inputValue = input.trim();
        if (!inputValue) return;

        const exists = value.some((x) => x.toLowerCase() === inputValue.toLowerCase());
        if (exists) {
            setInput("");
            return;
        }

        onChange([...value, inputValue]);
        setInput("");
    };

    const removeSuperpower = (item: string) => {
        onChange(value.filter((x) => x !== item));
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSuperpower();
        }
    };
    return (
        <div className={styles["superpower"]}>
            <div className={styles["superpower-input"]}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="e.g. Flight"
                />
                <button type="button"
                        onClick={addSuperpower}
                        disabled={!input}
                        aria-label="Add superpower"
                >
                    +
                </button>
            </div>

            <div className={styles["superpower-chips"]}>
                {value.map((p) => (
                    <p key={p} className={styles["superpower-chip"]}>
                        {p}
                        <span
                            onClick={() => removeSuperpower(p)}
                            aria-label={`Remove ${p}`}
                        >
                             ×
                        </span>
                    </p>
                ))}
            </div>
        </div>
    )
}