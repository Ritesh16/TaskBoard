import { Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTasks } from '../../lib/hooks/useTasks';

export default function TaskDetail({ taskId }: { taskId: number }) {
  const { userTask, userTaskLoading } = useTasks(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState('');

  // Update details when task loads
  useEffect(() => {
    if (userTask) {
      setDetails(''); // Initialize with empty string or fetch from API if available
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

  const formattedDate = userTask.date 
    ? new Date(userTask.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : 'N/A';

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
        <Row className="mb-3">
          <Col>
            <small className="text-muted d-block">Due Date</small>
            <p className="mb-0">{formattedDate}</p>
          </Col>
        </Row>

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
            readOnly={!isEditing}
            className={!isEditing ? 'bg-light' : ''}
          />
        </Form.Group>

        {isEditing && (
          <div className="d-flex gap-2">
            <Button 
              size="sm" 
              variant="primary"
              onClick={() => {
                // TODO: Call mutation to save details
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
      </Card.Body>
    </Card>
  );
}
