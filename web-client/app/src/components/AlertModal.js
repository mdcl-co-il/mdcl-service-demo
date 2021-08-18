import {Modal} from "react-bootstrap";


export default function AlertModal(props) {

    const close = async () => {
        await props.ctx.confirm(false);
    };

    return (
        <Modal
            {...props}
            centered
        >
            <Modal.Header>
                <Modal.Title>{props.ctx.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.ctx.message}</Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-sm btn-outline-dark forms-list-btn"
                        onClick={close}>Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}