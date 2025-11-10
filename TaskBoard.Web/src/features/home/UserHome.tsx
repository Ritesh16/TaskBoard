import { Badge, Button, Card, Col, Form, InputGroup, ListGroup, Row, Tab } from 'react-bootstrap';
import logo from '../../assets/save.png';
import { useState, type ChangeEvent, type FormEvent } from 'react';

export default function UserHome() {
    const [value, setValue] = useState<string>('');
    const [activeKey, setActiveKey] = useState<string>('#link1');
    const [section3Data, setSection3Data] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submitted:', value);
        setValue('');
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const loadTask = (taskId: string) => {
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
                    if (typeof k === 'string') {
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
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group as={Col} controlId="validationCustomUsername">
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="text"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                onChange={handleChange}
                                            />
                                            <InputGroup.Text id="inputGroupPrepend" style={{ cursor: 'pointer' }}>
                                                <img src={logo} alt="Logo" onClick={(e) => {
                                                    const form = e.currentTarget.closest('form');
                                                    if (form) form.requestSubmit();
                                                }} />
                                            </InputGroup.Text>
                                            <Form.Control.Feedback type="invalid">
                                                Please choose a username.
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                                <main className="center-wrap">
                                    <div className="center-content">
                                        <div className="card p-3">
                                            <ListGroup as="ol">
                                                <ListGroup.Item
                                                    style={{ cursor: 'pointer' }}
                                                    as="li"
                                                    className="d-flex justify-content-between align-items-start"
                                                >
                                                    <div className="ms-2 me-auto" onClick={() => loadTask('Task 1')}>
                                                        <div className="fw-bold">Task 1</div>
                                                        CategoryName Wednesday, Jul 16
                                                    </div>
                                                    <Badge bg="primary" pill>
                                                        14
                                                    </Badge>
                                                </ListGroup.Item>
                                                <ListGroup.Item
                                                    as="li"
                                                    className="d-flex justify-content-between align-items-start"
                                                >
                                                    <div className="ms-2 me-auto">
                                                        <div className="fw-bold">Subheading</div>
                                                        Cras justo odio
                                                    </div>
                                                    <Badge bg="primary" pill>
                                                        14
                                                    </Badge>
                                                </ListGroup.Item>
                                                <ListGroup.Item
                                                    as="li"
                                                    className="d-flex justify-content-between align-items-start"
                                                >
                                                    <div className="ms-2 me-auto">
                                                        <div className="fw-bold">Subheading</div>
                                                        Cras justo odio
                                                    </div>
                                                    <Badge bg="primary" pill>
                                                        14
                                                    </Badge>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </div>
                                </main>

                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">Tab pane content 2</Tab.Pane>
                        </Tab.Content>
                    </Col>
                    <Col sm={3}>
                        <div style={{ minHeight: '200px' }}>
                            {section3Data ? (
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Details</Card.Title>
                                        <Card.Text>{`Loaded: ${section3Data}`}</Card.Text>
                                        <Button size="sm" variant="secondary" onClick={() => setSection3Data(null)}>
                                            Clear
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <div className="text-muted">No item selected — details will appear here.</div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    )
}