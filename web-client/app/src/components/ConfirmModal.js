import {Modal} from "react-bootstrap";


export default function ConfirmModal(props) {

    const close = async () => {
        await props.ctx.confirm(false);
    };

    const ok = async () => {
        await props.ctx.confirm(true);
    };

    return (
        <Modal
            {...props}
            centered
        >
            <Modal.Body>{props.ctx.message}</Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-sm btn-outline-dark forms-list-btn"
                        onClick={close}>Cancel
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger forms-list-btn"
                        onClick={ok}>Ok
                </button>
            </Modal.Footer>
        </Modal>
    )
}