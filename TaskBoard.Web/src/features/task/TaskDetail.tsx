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
import { useToast } from '../../app/shared/components/toast/useToast';

export default function TaskDetail({ taskId }: { taskId?: number }) {
  const { userTask, userTaskLoading, saveTaskDetails } = useTasks(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const { userCategories } = useCategory();
  const toast = useToast();

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
    await saveTaskDetails.mutateAsync(data, {
      onError: (error) => {
        console.log(error);
        toast.error("User/Password does not match the system.");
      }
    });

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
      <Card.Header className="bg-primary bg-opacity-10 border-0 p-3" style={{ paddingBottom: '0.75rem' }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1" style={{ fontSize: '1.1rem' }}>{userTask.title}</Card.Title>
            <Badge bg="info" text="dark" style={{ fontSize: '0.75rem' }}>{userTask.categoryName}</Badge>
          </div>
          <Button size="sm" variant="outline-secondary" onClick={() => setIsEditing(!isEditing)} style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}>
            {isEditing ? '✕' : '✎'}
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          {isEditing && (
            <>
              <Form.Group className="mb-2">
                <Form.Label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>Category</Form.Label>
                <Controller name="categoryId" control={control} render={({ field }) => { const selectedCategory = userCategories.find(c => c.categoryId === field.value); return (<Dropdown className="mb-2" onSelect={(eventKey) => field.onChange(Number(eventKey))}><Dropdown.Toggle size="sm" variant="secondary" className="w-100" style={{ fontSize: '0.85rem' }}>{selectedCategory?.name || 'Select...'}</Dropdown.Toggle><Dropdown.Menu className="w-100" style={{ fontSize: '0.85rem' }}>{userCategories.map((uc) => (<Dropdown.Item eventKey={uc.categoryId} key={uc.categoryId}>{uc.name}</Dropdown.Item>))}</Dropdown.Menu></Dropdown>); }} />
                {errors.categoryId && (<Form.Text className="text-danger" style={{ fontSize: '0.75rem' }}>{errors.categoryId.message}</Form.Text>)}
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>Details</Form.Label>
                <Controller name="details" control={control} render={({ field }) => (<><Form.Control as="textarea" rows={2} placeholder="Add details..." {...field} className="form-control-sm" style={{ fontSize: '0.85rem' }} /><Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>{field.value?.length ?? 0} / 2000</Form.Text></>) } />
                {errors.details && (<Form.Text className="text-danger" style={{ fontSize: '0.75rem' }}>{errors.details.message}</Form.Text>)}
              </Form.Group>

              <div className="d-flex gap-1 mb-3">
                <Button size="sm" variant="primary" type="submit" style={{ fontSize: '0.85rem' }}>Save</Button>
                <Button size="sm" variant="outline-secondary" onClick={() => { setIsEditing(false); reset(); }} style={{ fontSize: '0.85rem' }}>Cancel</Button>
              </div>
            </>
          )}
          {!isEditing && (
            <div className="mb-3">
              {userTask && (userTask as unknown as { details?: string }).details && (
                <div>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>Details</small>
                  <p className="mb-0" style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {(userTask as unknown as { details?: string }).details}
                  </p>
                </div>
              )}
            </div>
          )}
        </form>

        <hr style={{ margin: '0.5rem 0' }} />

        <TaskSchedule userTask={userTask} />

      </Card.Body>
    </Card>
  );
}
