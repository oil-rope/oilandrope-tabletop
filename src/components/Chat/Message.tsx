import dayjs from 'dayjs';

import React, { FC, useContext } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { AuthContext } from '@Contexts';
import { ChatContext } from './context';
import { MESSAGE_COLORS } from './const';
import { IRoll } from '@Interfaces';

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
    roll: PropTypes.any,
  }).isRequired,
};

type MessageTypes = InferProps<typeof MessageProps>;
export const Message: FC<MessageTypes> = ({ message }) => {
  const { user, bot } = useContext(AuthContext);
  const { colorMap } = useContext(ChatContext);

  // If user is not loaded don't even bother about rendering or logic
  if (!user) return <></>;

  /**
   * Checks if the person whom message belongs to is user.
   * Object @interface IUser is got from context.
   *
   * @returns {Boolean} User is author.
   */
  const isAuthor = (): boolean => {
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
   * @returns {string} The color assigned to the user.
   */
  const getColor = (): typeof MESSAGE_COLORS[number] | 'light' => {
    if (isAuthor()) return 'light';
    if (!colorMap) return 'light';
    if (colorMap[message.author.id]) return colorMap[message.author.id];
    const color = randomColor();
    colorMap[message.author.id] = color;
    return color;
  };

  /**
   * This function will return a formatted dice roll.
   * The format will be 'xDy: [result x times], zDy: [result z times]'.
   *
   * @returns {string} The roll if given.
   */
  const getTitle = (): string => {
    if (!message.roll) return '';
    return Object.entries(message.roll as IRoll)
      .map(([key, value]) => `${key}: [${value}]`)
      .join(', ');
  };

  const getBackgroundColorClass = (): string => {
    if (isAuthor()) return 'secondary';
    if (!bot || message.author.id !== bot.id) return 'primary';
    return 'light';
  };

  return (
    <Row
      className={`justify-content-${isAuthor() ? 'end' : 'start'} m-0 mb-2`}
      style={{ minHeight: '50px' }}
    >
      <Col
        xs={10}
        md={8}
        className={`bg-${getBackgroundColorClass()} border`}
        style={{ borderRadius: '10px' }}
        role="message"
      >
        <p className="mb-0" title={getTitle()}>
          <small
            className={`text-${getColor()} text-decoration-underline fw-bold`}
          >
            {message.author.username}
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
      </Col>
    </Row>
  );
};

Message.propTypes = MessageProps;
