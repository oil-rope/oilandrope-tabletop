import React, { FC } from 'react';
import { FallbackProps } from 'react-error-boundary';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Container>
      <h1 className="fw-lighter text-center">Something went wrong:</h1>
      <Row className="justify-content-around">
        <Col xs={12}>
          <p className="text-center">{error.message}</p>
        </Col>
        <button
          className="btn btn-dark col-11 col-md-7 col-xl-2"
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
      </Row>
    </Container>
  );
};

export default ErrorFallback;
