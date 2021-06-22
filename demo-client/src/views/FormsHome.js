import {FormsSvc, UtilsSvc} from '../services'
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useHistory} from 'react-router-dom';

export default function FormsHome() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState([]);


    const newForm = async (e) => {
        const formId = await FormsSvc.newForm();
        e.preventDefault();
        history.push("/v2/formEditor/" + formId);
    };

    useEffect(() => {
        const loadForms = async () => {
            setLoading(true);
            const forms = await FormsSvc.loadForms();
            setForms(forms);
            setLoading(false);
        };
        loadForms();
        return () => {
        };
    }, []);

    return (
        <>
            <h3>Forms</h3>
            <button type="button" className="btn btn-outline-dark" onClick={newForm}>New Form</button>
            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Last Update</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {forms.map((row, i) =>
                            <tr key={'form_' + row.id}>
                                <td>{row.title}</td>
                                <td>{UtilsSvc.formatTimeStampToString(row.lastModifiedDate)}</td>
                                <td>
                                    <Link to={'/v2/formEditor/' + row.id}>
                                        <button type="button" className="btn btn-sm btn-outline-dark">Edit Form</button>
                                    </Link>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}