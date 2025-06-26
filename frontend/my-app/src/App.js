import './App.css';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';


import Header from './Header';
import Register from './Users/Register';
import Login from './Users/Login';
import Invoice from './Users/Invoice';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './Home';


function App() {
  // useEffect(() => {
  //   store.dispatch(loadUser());
  // }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invoices" element={
            <Container style={{ border: '2px solid black', borderRadius: '10px', background: '#E5C9C9' }}>
              <Header />
              <ProtectedRoute>
                <Invoice />
              </ProtectedRoute>
            </Container>
          } />
        </Routes>
        <ToastContainer position="bottom-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
