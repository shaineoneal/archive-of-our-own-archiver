import { useEffect } from "react";
import { makeRequest } from "../chrome-services/utils/httpRequest";
import Logout from "./Logout";

export const TestingButton = () => {

    function doThing() {
        fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=***REMOVED***`).then(r => console.log(r, r.body)).then(r => console.log(r));
    }

    useEffect(() => {
        console.log("button mounted");
    }, []);

    return (
        <div>
            <button onClick={() => doThing()}>
                Click me
            </button>
        </div>
    );
};
