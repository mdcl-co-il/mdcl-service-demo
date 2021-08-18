import {XCircle} from "react-bootstrap-icons";
import '../Wizards.css';
import WizardCodeBlock from "./CodeBlock";
import WizardEntity from "./Entity";

const partLoader = (type, data) => {
    switch (type) {
        case "codeBlock":
            return <WizardCodeBlock data={data}/>;
        case "entity":
            return <WizardEntity data={data}/>;
        default:
            return <>Empty</>
    }
};

export default function WizardPart(props) {
    return (
        <div className="container wizard-part">
            <div className="row wizard-part">
                <div className="col wizard-part-left">
                    Left
                </div>
                <div className="col">
                    {partLoader(props.data.type, props.data)}
                </div>
                <div className="col wizard-part-right">
                    <button className="btn btn-sm" onClick={() => props.removeMe()}><XCircle/></button>
                </div>
            </div>

        </div>
    )
}