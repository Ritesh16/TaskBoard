import { Card, Button, Form, Badge, DropdownButton, Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTasks } from '../../lib/hooks/useTasks';
import { taskDetailSchema, type TaskDetailFormData } from '../../lib/schemas/taskDetailSchema';
import { useCategory } from '../../lib/hooks/useCategory';
import { useToast } from '../../app/shared/components/toast/useToast';
import TaskSchedule from './TaskSchedule';

export default function TaskDetail({ taskId }: { taskId?: number }) {
  const { userTask, userTaskLoading, saveTaskDetails } = useTasks(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const { userCategories } = useCategory();
  const toast = useToast();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<TaskDetailFormData>({
      resolver: zodResolver(taskDetailSchema),
      mode: 'onChange',
      defaultValues: {
        taskId,
        categoryId: undefined,   // keep undefined if schema expects number optional
        details: '',
      },
    });

  // Prefill as soon as userTask is available
  useEffect(() => {
    if (!userTask) return;
    reset({
      taskId: userTask.taskId,
      categoryId: userTask.categoryId ?? undefined, // set directly from API
      details: userTask.details ?? '',
    });
  }, [userTask, reset]);

  // Current selected category id from form state
  const selectedCategoryId = watch('categoryId');
  const selectedCategoryName =
    userCategories.find(c => c.categoryId === selectedCategoryId)?.name || 'Select...';

  const onSubmit = async (data: TaskDetailFormData) => {
    try {
      await saveTaskDetails.mutateAsync(data);
      toast.success('Saved');
    } catch (e) {
      console.log(e);
      toast.error('Problem in saving task details.');
    }
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
      <Card.Header className="bg-primary bg-opacity-10 border-0 p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1" style={{ fontSize: '1.1rem' }}>
              {userTask.title}
            </Card.Title>
            <Badge bg="info" text="dark" style={{ fontSize: '0.75rem' }}>
              {userTask.categoryName}
            </Badge>
          </div>
          <Button size="sm" variant="outline-secondary" onClick={() => setIsEditing(!isEditing)}
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}>
            {isEditing ? '✕' : '✎'}
          </Button>

        </div>
      </Card.Header>

      <Card.Body className="p-3">
        <Form onSubmit={handleSubmit(onSubmit)}>
          {isEditing && (
            <>
              <input type="hidden" {...register('taskId', { valueAsNumber: true })} />
              <Form.Group className="mb-2">
                <Form.Label className="text-muted" style={{ fontSize: '0.85rem' }}>Category</Form.Label>
                <DropdownButton
                  id="dropdown-category"
                  size="sm"
                  variant="secondary"
                  className="w-100"
                  title={selectedCategoryName}
                  onSelect={(key) => {
                    if (key == null) return;
                    const id = Number(key);
                    if (!Number.isNaN(id)) {
                      setValue('categoryId', id, { shouldDirty: true, shouldValidate: true });
                    }
                  }}
                >
                  {userCategories.map((c) => (
                    <Dropdown.Item
                      eventKey={String(c.categoryId)}
                      key={c.categoryId}
                      active={c.categoryId === selectedCategoryId}
                    >
                      {c.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>

                {errors.categoryId && (
                  <Form.Text className="text-danger" style={{ fontSize: '0.75rem' }}>
                    {errors.categoryId.message}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-muted" style={{ fontSize: '0.85rem' }}>Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Add details..."
                  className="form-control-sm"
                  style={{ fontSize: '0.85rem' }}
                  {...register('details')}
                />
                {errors.details && (
                  <Form.Text className="text-danger" style={{ fontSize: '0.75rem' }}>
                    {errors.details.message}
                  </Form.Text>
                )}
              </Form.Group>

              <div className="d-flex gap-1 mb-3">
                <Button size="sm" variant="primary" type="submit" style={{ fontSize: '0.85rem' }}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  type="button"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => { setIsEditing(false); reset(); }}
                >
                  Cancel
                </Button>
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
              {(!userTask?.details || userTask.details.trim() === '') && (
                <div>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>Details</small>
                  <p className="mb-0" style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    No details
                  </p>
                </div>
              )}
            </div>
          )}
        </Form>
          <hr style={{ margin: '0.5rem 0' }} />

        <TaskSchedule userTask={userTask} />

      </Card.Body>
    </Card>
  );
}
