import { useEffect } from "react";
import { makeRequest } from "../chrome-services/utils/httpRequest";
import Logout from "./Logout";

export const TestingButton = () => {

    function doThing() {
        fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjczZTI1Zjk3ODkxMTljNzg3NWQ1ODA4N2E3OGFjMjNmNWVmMmVkYTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5NzIyODMwNjUxMzktaHRvaDRnMjJkZWdwcjI0NWU2ZXVwbWJuMmlqOG9mZGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NzIyODMwNjUxMzktaHRvaDRnMjJkZWdwcjI0NWU2ZXVwbWJuMmlqOG9mZGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTUxMDg0MjUzOTMyMzIzMDMwNTYiLCJlbWFpbCI6ImlwcmVmZXJyZWFkaW5nb3ZlcmNvb2tpZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJFLWhRQVhaUktfMmo3dFphdEIxRnVBIiwiaWF0IjoxNzI5Mjk4NzkxLCJleHAiOjE3MjkzMDIzOTF9.pMtMyz7DLY8Fq-uBZKSEXScL_d6zKP6SYs2r6hvvKuIaTqVsJzzfg9At6gOmWLJPEpI0kRraMgRSmXmvaLQN8iQe4q4YGByNRMALBdHzblqRZIq0BS1se_4TakGJvFLO_L72ypcxJw9Tzh7De-IxEoLYHSGGw7khE2gGi33gBARZ-JKHMjXm3WD8YlLvasmXVc4cJs0_pPwAdeaAq0krwj0GIibRG0hwFaicGJzFbmk6tRVEa95blJ77UZ9_UohGqtznParQYxJJlURy3LTgptHXdCkmM9GY7EsWEYSvhHcUsyUsvwubrY6QX3-l8B2Mq8YcMVFuodE7DgwFmLxSbA`).then(r => console.log(r, r.body)).then(r => console.log(r));
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
