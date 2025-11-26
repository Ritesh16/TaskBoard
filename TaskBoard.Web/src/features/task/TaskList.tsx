import { ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import { formatDate } from '../../lib/util/util';
import { useTasks } from '../../lib/hooks/useTasks';


export default function TaskList({onSelect}: {onSelect: (taskId: number) => void}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {userTasks, userTasksLoading } = useTasks();

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelect(id);
  };

  return (
    <main className="center-wrap">
      {userTasksLoading ? (
        <div>
          Loading tasks...
        </div>
      ) :
        (
          <div className="center-content">
            {userTasks.length === 0 ? (
              <h4>No tasks exists</h4>
            ) :
              <div className="card p-3">
                <ListGroup as="ol">
                  {userTasks.map((it) => (
                    <ListGroup.Item
                      key={it.taskId}
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                      onClick={() => handleSelect(it.taskId)}
                      active={selectedId === it.taskId}
                      action
                      style={selectedId === it.taskId ? { cursor: 'pointer', backgroundColor: '#e9ecef', color: '#000' } : { cursor: 'pointer' }}
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{it.title}</div>
                        <div className="text-muted">{it.categoryName}</div>
                      </div>
                      <div className="text-end text-muted me-2" style={{ minWidth: 110 }}>
                        {formatDate(it.date)}
                      </div>
                      {/* <Badge bg="primary" pill>
              0
            </Badge> */}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            }

          </div>
        )
      }
    </main>
  );
}
