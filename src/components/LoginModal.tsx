import React, { FC, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { getToken } from '@Utils/apiCalls';

const LoginModalProps = {
  onLogin: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
};

type LoginModalTypes = InferProps<typeof LoginModalProps>;
const LoginModal: FC<LoginModalTypes> = ({ onLogin, onFail }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(true);

  return (
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title>
          Authentication required
          <br />
          <small className="lead text-muted">
            You can also login on{' '}
            <a
              href="https://oilandrope-project.com/accounts/auth/login/"
              target="_blank"
              rel="noreferrer"
            >
              Oil &amp; Rope
            </a>
          </small>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            /*getToken(username, password)
              .then(({ token }) => {
                sessionStorage.setItem('authtoken', token);
                setShow(false);
                onLogin();
              })
              .catch(() => onFail());
              */
             onLogin();
          }}
        >
          <Form.Group className="mb-3" controlId="id_username">
            <Form.Label>Username or email</Form.Label>
            <Form.Control
              value={username}
              type="text"
              placeholder="Username or email"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="id_password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              type="password"
              placeholder="*******"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

LoginModal.propTypes = LoginModalProps;

export default LoginModal;
