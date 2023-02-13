import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import './Transaction.css';

const Transaction = (props) => {
    const [address,setAddress] = useState();
    const [amount,setAmount] = useState(0);
    const [error,setError] = useState();
    const onSubmit = () => {
        if(address === "" || amount<=0){
            setError("Please Enter valid details");
        }
        props.handleSubmit(address,amount);
    }
    return(
        <Form className='transaction-main'>
        <h2>Ease your transactions using this!!</h2>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Receiver's Address
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" onChange={e => setAddress(e.target.value)}/>
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                ETH to be transferred
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="number" onChange={e => setAmount(e.target.value)}/>
            </Col>
        </Form.Group>
        {error && <div>{error}</div>}
        <Button id="submit-btn" onClick={() => onSubmit()} disabled={props.disableTransact} variant="outline-dark" size='lg' className='btn'>Transact</Button>
        </Form>
    );
}

export default Transaction;