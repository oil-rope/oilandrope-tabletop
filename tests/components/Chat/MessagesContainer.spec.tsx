import faker from '@faker-js/faker';

import React from 'react';
import { render } from '@testing-library/react';

import { AuthContext } from '@Contexts';

import MessagesContainer from '@Components/Chat/MessagesContainer';

import { MessageMock, UserMock } from '../../__mocks__/helper';

// NOTE: User has to be logged in order for messages to be shown
describe('MessagesContainer suite', () => {
  it('renders correctly', () => {
    const { container } = render(<MessagesContainer messages={[]} />);

    expect(container).toBeInTheDocument();
  });

  it('renders messages', () => {
    const { getByText } = render(
      <AuthContext.Provider value={UserMock}>
        <MessagesContainer messages={[MessageMock]} />
      </AuthContext.Provider>,
    );

    expect(getByText(MessageMock.message)).toBeInTheDocument();
  });

  it('renders multiple messages', () => {
    const messageMock = Object.assign(
      { message: faker.lorem.words() },
      MessageMock,
    );
    const { getAllByText } = render(
      <AuthContext.Provider value={UserMock}>
        <MessagesContainer messages={[MessageMock, messageMock]} />
      </AuthContext.Provider>,
    );
    const messagesComponents = getAllByText(MessageMock.author.username);

    expect(messagesComponents.length).toEqual(2);
  });
});
