import { Col, Row, Tab, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import AddTask from '../task/AddTask';
import TaskList from '../task/TaskList';
import TaskDetail from '../task/TaskDetail';
import CategoryList from '../category/CategoryList';

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
                        <hr />
                         <ListGroup>
                            <ListGroup.Item action eventKey="#link5">
                                Category
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey="#link6">
                                Statistics
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey="#link7">
                                Summary
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey="#link8">
                                Trash
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="#link3">
                                <Row>
                                    <Col sm={8}>
                                        <AddTask />
                                        <TaskList onSelect={loadTask} />
                                    </Col>

                                    <Col sm={4}>
                                        <TaskDetail taskId={selectedTaskId} />
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                                Tab pane content 2
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link5">
                                {/*<CategoryList />*/}
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                    {/* <Col sm={3}>
                        <div style={{ minHeight: '200px' }}>
                             <TaskDetail taskId={selectedTaskId} /> 
                        </div>
                    </Col> */}
                </Row>
            </Tab.Container>
        </>
    )
}