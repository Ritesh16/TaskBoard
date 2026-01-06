import { Col, Row, Tab, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import AddTask from '../task/AddTask';
import TaskList from '../task/TaskList';
import TaskDetail from '../task/TaskDetail';

export default function UserHome() {
    const [activeKey, setActiveKey] = useState<string>('#link3');
    const [selectedTaskId, setSelectedTaskId] = useState<number>();

    const loadTask = (taskId: number) => {
        // load details into section-3
        setSelectedTaskId(taskId);
    };

    return (
        <>
            <Tab.Container
                id="list-group-tabs-example"
                activeKey={activeKey}
                onSelect={(k) => {
                    // normalize the selection value and avoid passing unexpected types to setSelectedTaskId
                    if (k == null) return;
                    setActiveKey(k as string);
                    if (typeof k === 'number') {
                        // clear section-3 whenever a new top-level section (col-1) is selected
                        setSelectedTaskId(k);
                    } else {
                        setSelectedTaskId(undefined);
                    }
                }}
            >
                <Row>
                    <Col sm={3}>
                        <ListGroup>
                            <ListGroup.Item action eventKey="#link1">
                                Today
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey="#link2">
                                Next 7 Days
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey="#link3">
                                All
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey="#link4">
                                Completed
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col sm={6}>
                        <Tab.Content>
                            <Tab.Pane eventKey="#link3">
                                <AddTask />
                              <TaskList onSelect={loadTask} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                                Tab pane content 2
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                    <Col sm={3}>
                        <div style={{ minHeight: '200px' }}>
                             <TaskDetail taskId={selectedTaskId} /> 
                        </div>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    )
}