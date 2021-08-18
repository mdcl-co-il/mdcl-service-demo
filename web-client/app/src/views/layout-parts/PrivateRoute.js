import {useAuthContext} from "../../contexts/AuthContext";
import NotAuthorized from "../NotAuthorized";

export default function PrivateRoute({children, ...rest}) {
    const authContext = useAuthContext();
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