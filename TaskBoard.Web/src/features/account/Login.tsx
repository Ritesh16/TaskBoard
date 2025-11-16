import { Alert, Button, Col, Container, FloatingLabel, Row } from "react-bootstrap";
import Form from "react-bootstrap/esm/Form";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../lib/hooks/useAccount";
import { useToast } from "../../app/shared/components/toast/useToast";
import { useState } from "react";
import AlertNotification from "../../app/shared/components/AlertNotification";


export default function Login() {
  const { loginUser } = useAccount();
  const navigate = useNavigate();
  const toast = useToast();
  const [errorAlert, seterrorAlert] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginSchema) => {
    await loginUser.mutateAsync(data, {
      onError: (error) => {
        seterrorAlert(true);
        toast.error("User/Password does not match the system.");
      }
    });
  }

  const handleCancel = () => {
    navigate('/');
  }

  return (
    <>
      <h1>Login</h1>
      <hr />
      <Container fluid className='d-flex justify-content-center '>
        <div className="border rounded-3 shadow-sm p-4 bg-white w-100 mx-3" style={{ maxWidth: 720 }}>
          <Row>{errorAlert && (
            <AlertNotification type="danger" message="Invalid email/password" onClose={() => seterrorAlert(false)} />
          )}
            
            <Col sm>
              <Form onSubmit={handleSubmit(onSubmit)}>
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
                  <Form.Control.Feedback id="email-feedback" type="invalid" className="d-block" role="alert">
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
                      {...register("password")}
                      isInvalid={!!errors.password}
                      size="lg"
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback id="password-feedback" type="invalid" className="d-block" role="alert">
                    {String(errors.password?.message ?? '')}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Login in...' : 'Login'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    style={{ marginLeft: '15px' }}
                    onClick={handleCancel}>
                    Cancel
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