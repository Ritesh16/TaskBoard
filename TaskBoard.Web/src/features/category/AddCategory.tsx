import { useForm } from "react-hook-form";
import { addCategorySchema, type AddCategorySchema } from "../../lib/schemas/addCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useCategory } from "../../lib/hooks/useCategory";
import { useToast } from "../../app/shared/components/toast/useToast";

export default function AddCategory({ onCancelNavigate }: { onCancelNavigate?: () => void }) {
  const { saveCategory } = useCategory();
  const toast = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AddCategorySchema>({
    mode: 'onTouched',
    resolver: zodResolver(addCategorySchema)
  });

  const onSubmit = async (data: AddCategorySchema) => {
    console.log(data);
    await saveCategory.mutateAsync(data, {
      onSuccess: () => {
        toast.success('Category added successfully.');
        
        onCancel();
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      }
    });
  }

  const onCancel = () => {
    // clear the form
    reset();
    // if a navigation callback was provided by the parent, use it to switch to the Categories tab
    if (onCancelNavigate) {
      onCancelNavigate();
      return;
    }

    console.log('clicked cancelled.')
  }

  return (
    <>
      <h1>Add Category</h1>
      <hr />
      <Container fluid className='d-flex justify-content-center'>
        <div className="border rounded-3 shadow-sm p-4 bg-white w-100 mx-3" style={{ maxWidth: 720 }}>
          <Row>
            <Col sm>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formCategoryName">
                  <FloatingLabel
                    controlId="floatingCategoryName"
                    label="Category Name"
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
                <Form.Group className="mb-3" controlId="formCategoryDescription">
                  <FloatingLabel
                    controlId="floatingCategoryDescription"
                    label="Description"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      rows={5}
                      {...register('description')}
                      aria-describedby="description-feedback"
                      size="lg"
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    style={{ marginLeft: '15px' }}
                    onClick={() => onCancel()} >
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