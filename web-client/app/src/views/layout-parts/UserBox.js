import {useAuthContext} from "../../contexts/AuthContext";
import {AuthSvc} from "../../services";

export default function UserBox() {
    const authContext = useAuthContext();

    const logoutHandler = async () => {
        try {
            await AuthSvc.logout(authContext.user, authContext.refreshToken);
            authContext.logout();
        } catch (e) {

        }
    }

    if (authContext.profile) {
        return (
            <div className="userBox float-end">
                <span
                    className="align-middle name-wrapper">{authContext.profile.name} {authContext.profile.lastName}</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={logoutHandler}>Logout</button>
            </div>
        );
    } else {
        return (
            <></>
        );
    }
}