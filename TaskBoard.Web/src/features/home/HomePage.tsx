import { Button, Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <>
            <Container fluid className='mt-3'>
                <Row>
                    <Col sm>
                        <Button variant="primary">Welcome to Task Board. Click here to go to get started!</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}