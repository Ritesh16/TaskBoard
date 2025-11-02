import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterSchema>({
    mode: 'onTouched',
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterSchema) => {
    console.log(1, data);
  }

  return (
    <>
      <h1>Register</h1>
      <hr />
      <Container fluid className='d-flex justify-content-center ' >
        <div className="border rounded-3 shadow-sm p-4 bg-white w-100 mx-3" style={{ maxWidth: 720 }}>
          <Row>
            <Col sm>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formName">
                  <FloatingLabel
                    controlId="floatingName"
                    label="Name"
                    className="mb-3"
                  >
                    <Form.Control
                      {...register('name')}
                      isInvalid={!!errors.name}
                      size="lg"
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Email Address"
                    className="mb-3"
                  >
                    <Form.Control
                      {...register('email')}
                       isInvalid={!!errors.email}
                      size="lg"
                    />
                  </FloatingLabel>
                   <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      {...register('password')}
                      isInvalid={!!errors.password}
                      size="lg"
                    />
                  </FloatingLabel>
                   <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <FloatingLabel
                    controlId="floatingConfirmPassword"
                    label="Confirm Password"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      {...register('confirmPassword')}
                      isInvalid={!!errors.confirmPassword}
                      size="lg"
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...': 'Register'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    style={{ marginLeft: '15px' }}
                    onClick={() => reset()} >
                      Reset
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  )
}