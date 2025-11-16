import { ListGroup, Badge } from 'react-bootstrap';

export type TaskItem = {
  id: string;
  title: string;
  category?: string;
  date?: string;
  count?: number;
};

export default function TaskList({ items = [], onSelect }: { items?: TaskItem[]; onSelect: (id: string) => void }) {
  return (
    <div className="card p-3">
      <ListGroup as="ol">
        {items.map((it) => (
          <ListGroup.Item
            key={it.id}
            style={{ cursor: 'pointer' }}
            as="li"
            className="d-flex justify-content-between align-items-start"
            onClick={() => onSelect(it.id)}
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{it.title}</div>
              <div className="text-muted">{it.category}</div>
            </div>
            <div className="text-end text-muted me-2" style={{ minWidth: 110 }}>
              {it.date}
            </div>
            <Badge bg="primary" pill>
              {it.count ?? 0}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
