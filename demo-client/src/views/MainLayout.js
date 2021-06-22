import LeftMenu from "./layout-parts/LeftMenu";
import TopBar from "./layout-parts/TopBar";
import {Route, Switch} from "react-router-dom";
import Login from "./Login";
import FormsHome from "./FormsHome";
import FormBuilder from "../components/FormBuilder/FormBuilder";
import {FormsProvider} from "../contexts/FormsBuilderContext";

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
                        <Route path="/v2/login">
                            <Login />
                        </Route>
                        <Route path="/v2/formEditor">
                            <Route path="/v2/formEditor/:form_id">
                                <FormsProvider>
                                    <FormBuilder/>
                                </FormsProvider>
                            </Route>
                        </Route>
                        <Route path="/v2/formsHome">
                            <FormsHome/>
                        </Route>
                        <Route path="/v2">
                            <FormsHome/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}