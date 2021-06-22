import {AuthContext} from "../../contexts/AuthContext";
import {useContext} from "react";
import {AuthSvc} from "../../services";

export default function UserBox() {
    const authContext = useContext(AuthContext);

    const logoutHandler = async () => {
        try {
            await AuthSvc.logout(authContext.user, authContext.refreshToken);
            authContext.logout();
        } catch (e) {
            //setFormError(e.toString());
        }
    }

    if (authContext.profile) {
        return (
            <div className="userBox float-end">
                <span className="align-middle">{authContext.profile.name} {authContext.profile.lastName}</span>
                <button type="button" className="btn btn-secondary" onClick={logoutHandler}>Logout</button>
            </div>
        );
    }
    else {
        return (
            <></>
        );
    }
}