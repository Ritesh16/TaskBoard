import { Card, Button, Form, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTasks } from '../../lib/hooks/useTasks';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskSchedule from './TaskSchedule';

export default function TaskDetail({ taskId }: { taskId?: number }) {
  const { userTask, userTaskLoading } = useTasks(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState('');

  

  // Update details and date when task loads
  useEffect(() => {
    if (userTask) {
      const meta = userTask as unknown as { details?: string; repeat?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom' };
      setDetails(meta.details ?? '');
      // setStartDate(userTask.date ? new Date(userTask.date) : new Date());
      // setRepeatOption(meta.repeat ?? 'None');
    }
  }, [userTask]);

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
        <Form.Group className="mb-3">
          <Form.Label className="text-muted">
            <small>Task Details</small>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Add or edit task details here..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className={!isEditing ? 'bg-light' : ''}
          />
        </Form.Group>

        {isEditing && (
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                // TODO: Call mutation to save details, date and repeat settings
                console.log('Save', { details });
                setIsEditing(false);
              }}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => {
                setIsEditing(false);
                setDetails('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        <TaskSchedule userTask={userTask} />
        
      </Card.Body>
    </Card>
  );
}
