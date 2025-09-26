import { useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    onClose: () => void
) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, onClose]);
}
