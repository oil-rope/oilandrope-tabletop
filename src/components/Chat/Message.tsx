import dayjs from 'dayjs';

import React, { FC, useContext } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { AuthContext } from '@Contexts';

const MessageProps = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    chat: PropTypes.number.isRequired,
    author: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    message: PropTypes.string.isRequired,
    entry_created_at: PropTypes.string.isRequired,
    entry_updated_at: PropTypes.string.isRequired,
  }).isRequired,
  colWidthXS: PropTypes.number,
  colWidthMD: PropTypes.number,
};

const MessageDefaults = {
  colWidthXS: 10,
  colWidthMD: 8,
};

type MessageTypes = InferProps<typeof MessageProps>;
const Message: FC<MessageTypes> = ({ message, colWidthXS, colWidthMD }) => {
  const user = useContext(AuthContext);

  const renderMessage = () => (
    <>
      <p className="mb-0">
        <small className="text-white font-weight-bold">
          <u>{message.author.username}</u>
        </small>
        <br />
        {message.message}
      </p>
      <p className="text-right mb-0">
        <small style={{ fontSize: '0.5rem' }} className="text-muted">
          {dayjs(message.entry_created_at).format(
            '[Sent on] DD/MM/YYYY [at] HH:mm',
          )}
        </small>
      </p>
    </>
  );

  if (message.author.id === user?.id) {
    return (
      <Row
        className="justify-content-end m-0 mb-2"
        style={{ minHeight: '50px' }}
      >
        <Col
          xs={colWidthXS || 0}
          md={colWidthMD || 0}
          className="bg-secondary border"
          style={{ borderRadius: '10px' }}
        >
          {renderMessage()}
        </Col>
      </Row>
    );
  }

  return (
    <Row
      className="justify-content-start m-0 mb-2"
      style={{ minHeight: '50px' }}
    >
      <Col
        xs={colWidthXS || 0}
        md={colWidthMD || 0}
        className="bg-info border"
        style={{ borderRadius: '10px' }}
      >
        {renderMessage()}
      </Col>
    </Row>
  );
};

Message.propTypes = MessageProps;
Message.defaultProps = MessageDefaults;

export default Message;
