import { Card, Button, Form, Badge, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTasks } from '../../lib/hooks/useTasks';
import { taskDetailSchema, type TaskDetailFormData } from '../../lib/schemas/taskDetailSchema';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskSchedule from './TaskSchedule';
import { useCategory } from '../../lib/hooks/useCategory';

export default function TaskDetail({ taskId }: { taskId?: number }) {
  const { userTask, userTaskLoading } = useTasks(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const { userCategories } = useCategory();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskDetailFormData>({
    resolver: zodResolver(taskDetailSchema),
    defaultValues: {
      taskId: userTask?.taskId ?? 0,
      title: userTask?.title ?? '',
      categoryId: 0,
      details: '',
    },
  });

  // Update form when task loads
  useEffect(() => {
    if (userTask) {
      const meta = userTask as unknown as { details?: string; repeat?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom'; categoryId?: number };
      // Find the category ID based on category name
      const category = userCategories.find(c => c.name === userTask.categoryName);
      reset({
        taskId: userTask.taskId,
        title: userTask.title,
        categoryId: category?.categoryId ?? 0,
        details: meta.details ?? ''
      });
    }
  }, [userTask, reset, userCategories]);

  const onSubmit = async (data: TaskDetailFormData) => {
    console.log('Form submitted with data:', data);
    // TODO: Call mutation to save task details
    setIsEditing(false);
  };

  if (userTaskLoading) {
    return (
      <div className="text-muted text-center py-5">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading details...</p>
      </div>
    );
  }

  if (!userTask) {
    return (
      <div className="text-muted text-center py-5">
        <p>📋 No item selected</p>
        <small>Select a task to view details</small>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-primary bg-opacity-10 border-0 pb-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1">{userTask.title}</Card.Title>
            <Badge bg="info" text="dark">{userTask.categoryName}</Badge>
          </div>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '✕ Cancel' : '✎ Edit'}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">
              <small>Category</small>
            </Form.Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => {
                const selectedCategory = userCategories.find(c => c.categoryId === field.value);
                return (
                  <Dropdown className="mb-3" onSelect={(eventKey) => field.onChange(Number(eventKey))}>
                    <Dropdown.Toggle
                      size="sm"
                      variant="secondary"
                      className="w-100"
                      disabled={!isEditing}
                    >
                      {selectedCategory?.name || 'Select...'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {userCategories.map((uc) => (
                        <Dropdown.Item eventKey={uc.categoryId} key={uc.categoryId}>
                          {uc.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                );
              }}
            />
            {errors.categoryId && (
              <Form.Text className="text-danger">{errors.categoryId.message}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-muted">
              <small>Task Details</small>
            </Form.Label>
            <Controller
              name="details"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Add or edit task details here..."
                    {...field}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-light' : ''}
                  />
                  <Form.Text className="text-muted">
                    {field.value?.length ?? 0} / 2000 characters
                  </Form.Text>
                </>
              )}
            />
            {errors.details && (
              <Form.Text className="text-danger">{errors.details.message}</Form.Text>
            )}
          </Form.Group>

          {isEditing && (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="primary"
                type="submit"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>

        <TaskSchedule userTask={userTask} />

      </Card.Body>
    </Card>
  );
}
