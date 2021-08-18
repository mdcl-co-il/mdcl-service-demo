import {UtilsSvc} from "../../../services"

export default function EntitySelect({data, extraData, onChangeCB}) {

    let selectedFormId = 0;

    if (extraData.hasOwnProperty("formId")) {
        selectedFormId = extraData.formId;
    } else {
        onChangeCB({
            formId: data[0].id
        });
    }

    const id = UtilsSvc.generateId();
    const update = (e) => {
        onChangeCB({
            formId: e.target.value
        });
    };

    return (
        <div className="form-floating mb-3">
            <select className="form-select" id={'formSelection_' + id} value={selectedFormId}
                    onChange={update}>
                {data.map((form, i) =>
                    <option key={id + '_form_' + form.id} value={form.id}>{form.title}</option>
                )}
            </select>
            <label htmlFor={'formSelection_' + id}>Link to Form</label>
        </div>
    );
}