import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card, CardBody } from 'reactstrap';

const Home = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Container>
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '1.5rem' }}>
            <CardBody className="d-flex flex-column align-items-center p-5">
              <h1 className="mb-2" style={{ fontWeight: 800, fontSize: '2.5rem', color: '#2d3a4b' }}>Invoice Generator</h1>
              <p className="mb-4" style={{ color: '#5a6a85', fontSize: '1.15rem' }}>
                Create, manage, and download invoices with ease.
              </p>
              <div className="d-flex flex-column gap-3 w-100 mt-2">
                <Link to="/login" className="w-100">
                  <Button color="primary" size="lg" block style={{ borderRadius: '2rem', fontWeight: 600 }}>Login</Button>
                </Link>
                <Link to="/register" className="w-100">
                  <Button color="secondary" size="lg" block style={{ borderRadius: '2rem', fontWeight: 600 }}>Register</Button>
                </Link>
                <Link to="/invoices" className="w-100">
                  <Button color="success" size="lg" block style={{ borderRadius: '2rem', fontWeight: 600 }}>Invoices</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Home; 