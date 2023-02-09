import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

const CustomModal = (props) => {
    return(
        <Modal show={true} onHide={() => props.handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Ooopss!!</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.error.message}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => props.handleClose()}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default CustomModal;