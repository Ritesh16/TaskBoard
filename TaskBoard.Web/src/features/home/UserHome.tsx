import { Col, Row, Tab, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import AddTask from '../task/AddTask';
import TaskList from '../task/TaskList';
import TaskDetail from '../task/TaskDetail';
import { useTasks } from '../../lib/hooks/useTasks';

export default function UserHome() {
    const {userTasks, userTasksLoading} = useTasks();
    const [activeKey, setActiveKey] = useState<string>('#link1');
    const [section3Data, setSection3Data] = useState<number | null>(null);
    

    const loadTask = (taskId: number) => {
        // load details into section-3
        console.log('loading task ->', taskId);
        setSection3Data(taskId);
    };

    return (
        <>
            <Tab.Container
                id="list-group-tabs-example"
                activeKey={activeKey}
                onSelect={(k) => {
                    if (typeof k === 'number') {
                        setActiveKey(k);
                        // clear section-3 whenever a new top-level section (col-1) is selected
                        setSection3Data(null);
                    }
                }}
            >
                <Row>
                    <Col sm={3}>
                        <ListGroup>
                            <ListGroup.Item action eventKey="#link1">
                                Link 1
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey="#link2">
                                Link 2
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col sm={6}>
                        <Tab.Content>
                            <Tab.Pane eventKey="#link1">
                                <AddTask />
                                <main className="center-wrap">
                                    <div className="center-content">
                                        {userTasks.length === 0  ? (
                                           <h4>No tasks exists</h4>
                                        ): 
                                        <TaskList
                                            items={userTasks}
                                            onSelect={loadTask}
                                        />
                                        } 
                                        
                                    </div>
                                </main>
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">Tab pane content 2</Tab.Pane>
                        </Tab.Content>
                    </Col>
                    <Col sm={3}>
                        <div style={{ minHeight: '200px' }}>
                            <TaskDetail taskId={section3Data} onClear={() => setSection3Data(null)} />
                        </div>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    )
}