import {useContext} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import NotAuthorized from "../NotAuthorized";

export default function PrivateRoute({children, ...rest}) {
    const authContext = useContext(AuthContext);
    let comp;
    if (authContext.isLoggedIn) {
        comp = children;
    } else {
        comp = <NotAuthorized/>
    }
    return (
        <>
            {comp}
        </>
    )
}