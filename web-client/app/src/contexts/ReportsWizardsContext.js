import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {WizardsSvc} from "../services";

const WizardsListDataCtx = createContext({});

export function WizardsListDataContext() {
    return useContext(WizardsListDataCtx);
}

const EntityReportListCtx = createContext({});

export function EntityReportListContext() {
    return useContext(EntityReportListCtx);
}

const WizardDataCtx = createContext({});

export function WizardDataContext() {
    return useContext(WizardDataCtx);
}

const WizardActionsCtx = createContext({});

export function WizardActionsContext() {
    return useContext(WizardActionsCtx);
}

export function ReportsWizardsProvider({children}) {
    let {wizard_id} = useParams();

    const [wizardActions, setWizardActions] = useState({});
    const [wizardData, setWizardData] = useState({});
    const [wizardsList, setWizardsList] = useState([]);
    const [entityReportsList, setEntityReportsList] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadWizardsContext = useCallback(async () => {
        setLoading(true);
        const entityReportsList = await WizardsSvc.getEntityReports();
        setEntityReportsList(entityReportsList);
        const wizardsList = await WizardsSvc.getWizardsList();
        setWizardsList(wizardsList);
        setWizardActions({
            updateWizard: WizardsSvc.updateWizard,
            deleteWizard: async (id) => {
                await WizardsSvc.deleteWizard(id);
                const wizardsList = await WizardsSvc.getWizardsList();
                setWizardsList(wizardsList);
            }
        });
        if (wizard_id) {
            const wizardData = await WizardsSvc.getWizardData(wizard_id);
            setWizardData(wizardData);
        }
        setLoading(false);
    }, [wizard_id]);

    useEffect(() => {

        loadWizardsContext()
            .then(() => {
            });
        return () => {
        };
    }, [wizard_id, loadWizardsContext]);

    return (
        <>
            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <>
                    <EntityReportListCtx.Provider value={entityReportsList}>
                        <WizardsListDataCtx.Provider value={wizardsList}>
                            <WizardActionsCtx.Provider value={wizardActions}>
                                <WizardDataCtx.Provider value={wizardData}>
                                    {children}
                                </WizardDataCtx.Provider>
                            </WizardActionsCtx.Provider>
                        </WizardsListDataCtx.Provider>
                    </EntityReportListCtx.Provider>
                </>
            )}
        </>
    );
}