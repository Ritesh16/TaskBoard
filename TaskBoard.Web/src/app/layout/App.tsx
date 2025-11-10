import './App.css';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import { Container } from 'react-bootstrap';

function App() {
  const location = useLocation();

  return (
    <>
      <NavBar />
      {location.pathname === '/' ? <HomePage /> : (
        <Container fluid className='mt-3'>

          <Outlet />

        </Container>

      )}

    </>
  )
}

export default App
