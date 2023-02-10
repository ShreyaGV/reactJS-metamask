import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './form.css';

const CustomForm = (props) => {
    return(
        <Form className='form-main'>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Wallet Address
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="email" placeholder={props.account} readOnly/>
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Balance
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="number" placeholder={props.balance} readOnly/>
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Network ID
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="number" placeholder={props.networkID} readOnly/>
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Network
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" placeholder={props.networkName} readOnly/>
            </Col>
        </Form.Group>
        </Form>
    );
}

export default CustomForm;