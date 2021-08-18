import LeftMenu from "./layout-parts/LeftMenu";
import TopBar from "./layout-parts/TopBar";
import {Route, Switch} from "react-router-dom";
import PrivateRoute from "./layout-parts/PrivateRoute";
import Login from "./Login";
import EntityBuilder from "../components/Entities/EntityBuilder/EntityBuilder";
import {FormsProvider} from "../contexts/FormsBuilderContext";
import FormFill from "../components/Entities/FormFill/FormFill";
import EntitiesHome from "./EntitiesHome";

export default function MainLayout() {
    return (
        <div className="container-fluid">
            <div className="row report-builder-wrapper">
                <div className="col-2 background-1">
                    <LeftMenu/>
                </div>
                <div className="col-10">
                    <TopBar/>
                    <Switch>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <PrivateRoute path="/entityEditor">
                            <Route path="/entityEditor/:form_id">
                                <FormsProvider>
                                    <EntityBuilder/>
                                </FormsProvider>
                            </Route>
                        </PrivateRoute>
                        <PrivateRoute path="/formFill">
                            <Route path="/formFill/:form_id">
                                <FormsProvider>
                                    <FormFill/>
                                </FormsProvider>
                            </Route>
                        </PrivateRoute>
                        <PrivateRoute path="/entitiesHome">
                            <EntitiesHome/>
                        </PrivateRoute>
                        <PrivateRoute path="/">
                            <EntitiesHome/>
                        </PrivateRoute>
                    </Switch>
                </div>
            </div>
        </div>
    );
}