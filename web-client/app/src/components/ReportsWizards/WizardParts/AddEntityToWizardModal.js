import {Button, Modal} from 'react-bootstrap'
import {useEffect, useState} from "react";
import {EntityReportListContext} from "../../../contexts/ReportsWizardsContext";


export default function AddEntityToWizardModal(props) {
    const {addEntity, ...rest} = props
    const entities = EntityReportListContext();
    const [entity, setEntity] = useState(null);

    const handleSelectionChange = async (element) => {
        if (element.target.value !== "0") {
            setEntity(entities.filter(entity => entity.id === element.target.value)[0]);
        } else {
            setEntity(null);
        }
    };

    const addEntityHandler = () => {
        if (entity) {
            addEntity(entity);
        }
    };

    useEffect(() => {
    }, [entity]);

    return (
        <>
            <Modal
                {...rest}
                animation={false}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Please select entity to import
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select className="form-select form-select-sm" aria-label=".form-select-sm"
                            onChange={handleSelectionChange}>
                        <option>Select entity</option>
                        {entities.map((entity, i) =>
                            <option key={'entity_' + entity.id} value={entity.id}>{entity.title}</option>
                        )}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={addEntityHandler} disabled={!entity}>Add
                        entity</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}