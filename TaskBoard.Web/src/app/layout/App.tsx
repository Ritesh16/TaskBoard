import './App.css'
import NavBar from './NavBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Dropdown, ListGroup, Row } from 'react-bootstrap'

function App() {
  return (
    <>
    <NavBar />
    <Container fluid className='mt-3'>
      <Row>
        <Col sm>
           <ListGroup>
            <ListGroup.Item active>Menu</ListGroup.Item>
            <ListGroup.Item action href="#board/1">Board 1</ListGroup.Item>
            <ListGroup.Item action href="#board/2">Board 2</ListGroup.Item>
            <ListGroup.Item action href="#board/3">Board 3</ListGroup.Item>
            <ListGroup.Item action href="#archive">Archive</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm={6}>
             <main className="center-wrap">
          <div className="center-content">
            <div className="card p-3">
              <h2>Overview</h2>
              <p>This is the main content area. Replace with your boards or data view.</p>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Example Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </main>
        </Col>
        <Col sm>
          <ListGroup>
            <ListGroup.Item active>Menu</ListGroup.Item>
            <ListGroup.Item action href="#board/1">Board 1</ListGroup.Item>
            <ListGroup.Item action href="#board/2">Board 2</ListGroup.Item>
            <ListGroup.Item action href="#board/3">Board 3</ListGroup.Item>
            <ListGroup.Item action href="#archive">Archive</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default App
