import React, { FC } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Message from './Message';

const MessagesContainerProps = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      chat: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      author: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        email: PropTypes.string.isRequired,
      }).isRequired,
      entry_created_at: PropTypes.string.isRequired,
      entry_updated_at: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

type MessagesContainerTypes = InferProps<typeof MessagesContainerProps>;
const MessagesContainer: FC<MessagesContainerTypes> = ({ messages }) => {
  return (
    <>
      {messages.map((message, index) => {
        return (
          <Message
            key={index}
            message={{
              id: message.id,
              chat: message.chat,
              entry_created_at: message.entry_created_at,
              entry_updated_at: message.entry_updated_at,
              message: message.message,
              author: {
                id: message.author.id,
                username: message.author.username,
              },
            }}
          />
        );
      })}
    </>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;

export default MessagesContainer;
