import dayjs from 'dayjs';

import React, { FC, Fragment, useContext } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { IMessage, IUser } from '@Interfaces';
import { AuthContext } from '@Contexts';
import { MESSAGE_COLORS } from './const';
import { ChatContext } from './context';

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

type MessageTypes = InferProps<typeof MessageProps>;
export const Message: FC<MessageTypes> = ({ message }) => {
  const user = useContext(AuthContext);
  const { colorMap, setColorMap } = useContext(ChatContext);

  /**
   * Checks if the person whom message belongs to is user.
   *
   * @param {IUser} user Logged user.
   * @returns {Boolean} User is author.
   */
  const isAuthor = (user: IUser) => {
    return message.author.id === user.id;
  };

  /**
   * Checks for usable colors and picks a random.
   *
   * @returns {String} Message color.
   */
  const randomColor = () => {
    return MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];
  };

  /**
   * This function checks if user id has a color in colorMap otherwise it returns
   * a random color from type BOOTSTRAP_COLORS.
   *
   * @param {IMessage} message Given user to set color.
   * @returns {string} The color assigned to the user.
   */
  const getColor = (
    message: IMessage,
  ): typeof MESSAGE_COLORS[number] | 'light' => {
    if (!user) return 'light';
    if (!colorMap) return 'light';
    if (colorMap[message.author.id]) return colorMap[message.author.id];
    if (isAuthor(user)) return 'light';
    const color = randomColor();
    setColorMap({ ...colorMap, [message.author.id]: color });
    return color;
  };

  const renderMessage = () => (
    <Fragment>
      <p className="mb-0">
        <small className={`text-${getColor(message as IMessage)} fw-bold`}>
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
    </Fragment>
  );

  if (!user) {
    // If user is not loaded yet we don't even bother about rendering
    return <></>;
  }

  return (
    <Row
      className={`justify-content-${isAuthor(user) ? 'end' : 'start'} m-0 mb-2`}
      style={{ minHeight: '50px' }}
    >
      <Col
        xs={10}
        md={8}
        className={`bg-${isAuthor(user) ? 'secondary' : 'primary'} border`}
        style={{ borderRadius: '10px' }}
        role="message"
      >
        {renderMessage()}
      </Col>
    </Row>
  );
};

Message.propTypes = MessageProps;
