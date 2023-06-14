import { useContext } from "react";
import { URLContext } from "../contexts/URLContext";

export function useURL() {
    const { url, setURL } = useContext(URLContext);
    return { url, setURL };
}

export default useURL;