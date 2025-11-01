import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/esm/Form";

export default function Login() {
  const [form, setForm] = useState({ email: '', password: ''});

   const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data (example: log or send to server)
    console.log('Submitting', form);
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleCancel = () => {
    console.log('Clicked cancel.');
  }

  return (
    <>
          <h1>Login</h1>
      <hr />
    <Container fluid className='mt-3' style={{width:'60%'}}>
      <Row>
        <Col sm>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={form.email} 
                placeholder="name@example.com" 
                onChange={handleEmailChange}
                required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password"
                name="password"
                value={form.password}
                onChange={handlePasswordChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button type="submit" variant="primary">Submit</Button>
              <Button onClick={handleCancel} variant="secondary" style={{marginLeft: '15px'}}>Cancel</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
    
  )
}