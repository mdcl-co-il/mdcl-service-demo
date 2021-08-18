import ReportForms from "./ReportForms";
import {useEffect, useRef, useState} from "react";
import {ReportSvc} from "../../services";

export default function ReportFieldSelection() {
    const [loading, setLoading] = useState(false);
    const [formsList, setFormsList] = useState([]);
    const [reportForms, setReportForms] = useState([]);
    const [formsMap, setFormsMap] = useState({});
    const reportFormSelectionRef = useRef();

    useEffect(() => {
        const loadForms = async () => {
            setLoading(true);
            const list = await ReportSvc.getFormsList();
            list.map(form => {
                formsMap[form.id] = form;
                return form;
            });
            setFormsMap(formsMap);
            setFormsList(list);
            setLoading(false);
        };
        loadForms();
        return () => {
        };
    }, [formsMap]);


    const handleFormAdd = async (e) => {
        const formId = reportFormSelectionRef.current.value;
        const fields = await ReportSvc.getFormFields(formId);
        if (reportForms.filter(form => form.id === formId).length === 0) {
            setReportForms(prevReportForms => {
                return [...prevReportForms, {
                    id: formId,
                    name: formsMap[formId].name,
                    fields
                }];
            })
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-9">
                    <div className="form-floating">
                        {loading ? (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <>
                                <select className="form-select" id="collectionSelect"
                                        ref={reportFormSelectionRef}>
                                    {formsList.map((form) => <option key={form.id}
                                                                     value={form.id}>{form.name}</option>)}
                                </select>
                                <label htmlFor="collectionSelect">Table</label>

                            </>
                        )}
                    </div>
                </div>
                <div className="col-3">
                    <button type="button" className="btn btn-secondary" onClick={handleFormAdd}>Add
                    </button>
                </div>
            </div>

            <div className="row">
                <ReportForms forms={reportForms}/>
            </div>
        </>
    );
}