import { Form, InputGroup, Col } from "react-bootstrap";
import logo from '../../assets/save.png';
import { useState, type ChangeEvent, type FormEvent } from "react";

export default function AddTask() {
    const [value, setValue] = useState<string>('');

     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log('Submitted:', value);
            setValue('');
        };
    
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Col} controlId="validationCustomUsername">
                    <InputGroup hasValidation>
                        <Form.Control
                            type="text"
                            aria-describedby="inputGroupPrepend"
                            required
                            onChange={handleChange}
                        />
                        <InputGroup.Text id="inputGroupPrepend" style={{ cursor: 'pointer' }}>
                            <img src={logo} alt="Logo" onClick={(e) => {
                                const form = e.currentTarget.closest('form');
                                if (form) form.requestSubmit();
                            }} />
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                            Please choose a username.
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Form>
        </>
    )
}