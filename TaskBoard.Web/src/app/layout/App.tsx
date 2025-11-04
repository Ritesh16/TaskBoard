import './App.css';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';

function App() {
  const location = useLocation();

  return (
    <>
      <NavBar />
      {location.pathname === '/' ? <HomePage /> : (
        <Container fluid className='mt-3'>
          <Row>
            <Col sm>
              <ListGroup>
                <ListGroup.Item action href="#board/1">Today</ListGroup.Item>
                <ListGroup.Item action href="#board/2">Next 7 days</ListGroup.Item>
                <ListGroup.Item action href="#board/3">All</ListGroup.Item>
                <ListGroup.Item action href="#archive">Completed</ListGroup.Item>
              </ListGroup>
                <ListGroup>
                <ListGroup.Item action href="#board/1">Category</ListGroup.Item>
                <ListGroup.Item action href="#board/2">Statistics</ListGroup.Item>
                <ListGroup.Item action href="#board/3">Summary</ListGroup.Item>
                <ListGroup.Item action href="#archive">Trash</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={6}>
              <Outlet />
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

      )}

    </>
  )
}

export default App
