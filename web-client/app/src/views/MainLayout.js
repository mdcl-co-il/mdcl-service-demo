import LeftMenu from "./layout-parts/LeftMenu";
import TopBar from "./layout-parts/TopBar";
import ReportBuilder from "../components/ReportBuilder/ReportBuilder";
import {Route, Switch} from "react-router-dom";
import PrivateRoute from "./layout-parts/PrivateRoute";
import Login from "./Login";
import ReportRawBuilder from "../components/ReportBuilder/ReportRawBuilder";
import EntityBuilder from "../components/Entities/EntityBuilder/EntityBuilder";
import {FormsProvider} from "../contexts/FormsBuilderContext";
import FormFill from "../components/Entities/FormFill/FormFill";
import EntityReport from "../components/Reports/EntityReport";
import EntityReportsHome from "./EntityReportsHome";
import SmartReportWizardsHome from "./SmartReportWizardsHome";
import ReportsWizard from "../components/ReportsWizards/ReportsWizard";
import {ReportsWizardsProvider} from "../contexts/ReportsWizardsContext";
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
                        <PrivateRoute path="/rawReport">
                            <Route path="/rawReport/:report_id">
                                <ReportRawBuilder/>
                            </Route>
                        </PrivateRoute>
                        <PrivateRoute path="/reportEditor">
                            <Route path="/reportEditor/:report_id">
                                <ReportBuilder/>
                            </Route>
                        </PrivateRoute>
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
                        <PrivateRoute path="/entityReport">
                            <Route path="/entityReport/:mode/:form_id/:entity_id">
                                <FormsProvider>
                                    <EntityReport/>
                                </FormsProvider>
                            </Route>
                        </PrivateRoute>
                        <PrivateRoute path="/entitiesHome">
                            <EntitiesHome/>
                        </PrivateRoute>
                        <PrivateRoute path="/entityReports">
                            <EntityReportsHome/>
                        </PrivateRoute>
                        <PrivateRoute path="/smartReport">
                            <Route path="/smartReport/Wizards">
                                <ReportsWizardsProvider>
                                    <SmartReportWizardsHome/>
                                </ReportsWizardsProvider>
                            </Route>
                            <Route path="/smartReport/Wizard/:wizard_id">
                                <ReportsWizardsProvider>
                                    <ReportsWizard/>
                                </ReportsWizardsProvider>
                            </Route>
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