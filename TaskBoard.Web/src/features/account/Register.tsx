import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";

export default function Register() {
  const { registerUser } = useAccount();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterSchema>({
    mode: 'onTouched',
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterSchema) => {
    console.log(1, data);
    await registerUser.mutateAsync(data, {
      onError: (error) => {
        console.log(error);
      }
    });
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
                      aria-describedby="name-feedback"
                      size="lg"
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback
                    id="name-feedback"
                    type="invalid"
                    className="d-block"
                    role="alert">
                    {String(errors.name?.message ?? '')}
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
                      aria-describedby="email-feedback"
                      size="lg"
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback
                    id="email-feedback"
                    type="invalid"
                    className="d-block"
                    role="alert">
                    {String(errors.email?.message ?? '')}
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
                      aria-describedby="password-feedback"
                      size="lg"
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback id="password-feedback" type="invalid" className="d-block" role="alert">
                    {String(errors.password?.message ?? '')}
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
                      aria-describedby="confirmPassword-feedback"
                      size="lg"
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback
                    id="confirmPassword-feedback"
                    type="invalid"
                    className="d-block"
                    role="alert">
                    {String(errors.confirmPassword?.message ?? '')}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Register'}
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