import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button, Col, Container, FloatingLabel, Row } from "react-bootstrap";
import Form from "react-bootstrap/esm/Form";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Process form data (example: log or send to server)
    console.log('Submitting', form);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate('/');
  }

  return (
    <>
      <h1>Login</h1>
      <hr />
      <Container fluid className='d-flex justify-content-center ' >
        <div className="border rounded-3 shadow-sm p-4 bg-white w-100 mx-3" style={{ maxWidth: 720 }}>
          <Row>
            <Col sm>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email Address"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      size="lg"
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Password"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      size="lg"
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Button type="submit" variant="primary">Submit</Button>
                  <Button onClick={handleCancel} variant="secondary" style={{ marginLeft: '15px' }}>Cancel</Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </>

  )
}