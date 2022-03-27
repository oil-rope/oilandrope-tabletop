import React, { FC } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const NotFoundProps = {
  message: PropTypes.string,
};
const NotFoundDefaults = {
  message: 'The element you are looking for does not exist.',
};

type NotFoundTypes = InferProps<typeof NotFoundProps>;
const NotFound: FC<NotFoundTypes> = ({ message }) => {
  return (
    <Container fluid={true} className="pt-3">
      <Row className="justify-content-around">
        <Col xs={12}>
          <p className="text-center">{message}</p>
        </Col>
        <a
          href="https://oilandrope-project.com"
          className="btn btn-primary col-11 col-md-7 col-xl-2"
        >
          <i className="ic ic-arrow-left"></i>
          Go back to Oil &amp; Rope
        </a>
      </Row>
    </Container>
  );
};

NotFound.propTypes = NotFoundProps;
NotFound.defaultProps = NotFoundDefaults;

export default NotFound;
