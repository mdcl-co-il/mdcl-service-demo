import {useContext, useState} from "react";
import {AuthSvc, UserSvc} from "../services";
import {AuthContext} from "../contexts/AuthContext";

export default function Login() {
    const [userName, setUserName] = useState("");
    const [userPass, setUserPass] = useState("");
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const authContext = useContext(AuthContext);

    const handleSubmit = async (evt) => {
        if(formLoading) return;
        evt.preventDefault();
        setFormLoading(true);
        try {
            const res = await AuthSvc.login(userName, userPass);
            authContext.login(res.data.accessToken, res.data.refreshToken, res.data.user, false);
            const profile = await UserSvc.loadProfile();
            authContext.setProfileData(profile);
            setFormLoading(false);
        } catch (e) {
            setFormError(e.toString());
            setFormLoading(false);
        }
    }

    const logoutHandler = async () => {
        try {
            await AuthSvc.logout(authContext.user, authContext.refreshToken);
            authContext.logout();
        } catch (e) {
            setFormError(e.toString());
        }
    }

    return (
        <>
            {authContext.isLoggedIn ? (
                <>
                    <button className="logout" onClick={logoutHandler}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="loginUserName" className="form-label">User Name</label>
                            <input type="text"
                                   value={userName}
                                   onChange={e => setUserName(e.target.value)}
                                   className="form-control"
                                   id="loginUserName"
                                   aria-describedby="userNameHelp"/>
                            <div id="userNameHelp" className="form-text">Login user name</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="loginPassword" className="form-label">Password</label>
                            <input type="password"
                                   value={userPass}
                                   onChange={e => setUserPass(e.target.value)}
                                   className="form-control"
                                   id="loginPassword"/>
                        </div>
                        <button type="submit" className="btn btn-secondary">Login</button>
                    </form>

                    <div className="loginFormError">{formError}</div>
                </>
            )}

        </>
    );
}