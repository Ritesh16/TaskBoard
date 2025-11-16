import { Card, Button } from 'react-bootstrap';

export default function TaskDetail({ taskId, onClear }: { taskId: string | null; onClear: () => void }) {
  if (!taskId) {
    return <div className="text-muted">No item selected — details will appear here.</div>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Details</Card.Title>
        <Card.Text>{`Loaded: ${taskId}`}</Card.Text>
        <Button size="sm" variant="secondary" onClick={onClear}>
          Clear
        </Button>
      </Card.Body>
    </Card>
  );
}
