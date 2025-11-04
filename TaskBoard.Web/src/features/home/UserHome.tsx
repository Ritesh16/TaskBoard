import { Badge, Col, Container, Dropdown, Form, InputGroup, ListGroup, Row } from 'react-bootstrap';
import logo from '../../assets/save.png';

export default function UserHome() {
    return (
        <Container fluid className='mt-3'>
            <Row>
                <Col>
                    <Form.Group as={Col} controlId="validationCustomUsername">
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <InputGroup.Text id="inputGroupPrepend">
                                <img src={logo} alt="Logo" />
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <main className="center-wrap">
                        <div className="center-content">
                            <div className="card p-3">
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
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
                </Col>
            </Row>
        </Container>
    )
}