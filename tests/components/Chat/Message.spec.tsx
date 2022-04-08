import React from 'react';
import { render, screen } from '@testing-library/react';

import { AuthContext } from '@Contexts';
import { ChatContext } from '@Components/Chat/context';

import { MessageMock, UserMock } from '../../__mocks__/helper';

import { Message } from '@Components/Chat';

const MessageMockedProps = {
  message: MessageMock,
};

describe('Message suite', () => {
  it('renders correctly', () => {
    const { container } = render(<Message {...MessageMockedProps} />);

    expect(container).toBeInTheDocument();
  });

  it('renders message correctly', () => {
    render(
      <AuthContext.Provider value={UserMock}>
        <Message {...MessageMockedProps} />
      </AuthContext.Provider>,
    );

    expect(screen.getByText(MessageMock.message)).toBeInTheDocument();
  });

  it("doesn't render message if user is not declared", () => {
    const { container } = render(<Message {...MessageMockedProps} />);

    expect(container).not.toHaveTextContent(MessageMock.message);
  });

  it('have secondary color if author is user', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.author.id = 1;
    const mockedUser = Object.assign({}, UserMock);
    mockedUser.id = 1;
    render(
      <AuthContext.Provider value={mockedUser}>
        <Message {...mockedProps} />
      </AuthContext.Provider>,
    );
    const messageContainer = screen.getByRole('message');

    expect(messageContainer).toHaveClass('bg-secondary');
  });

  it('have primary color if author is not user', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.author.id = 1;
    const mockedUser = Object.assign({}, UserMock);
    mockedUser.id = 2;
    render(
      <AuthContext.Provider value={mockedUser}>
        <Message {...mockedProps} />
      </AuthContext.Provider>,
    );
    const messageContainer = screen.getByRole('message');

    expect(messageContainer).toHaveClass('bg-primary');
  });

  it('renders username with text-light class if is author', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.author.id = 1;
    const mockedUser = Object.assign({}, UserMock);
    mockedUser.id = 1;
    render(
      <AuthContext.Provider value={mockedUser}>
        <Message {...mockedProps} />
      </AuthContext.Provider>,
    );
    const username = MessageMockedProps.message.author.username;
    const messageContainer = screen.getByText(username);

    expect(messageContainer).toHaveClass('text-light');
  });

  it('renders username with text-light class if colorMap is not declared', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.author.id = 1;
    const mockedUser = Object.assign({}, UserMock);
    mockedUser.id = 2;
    render(
      <AuthContext.Provider value={mockedUser}>
        <Message {...mockedProps} />
      </AuthContext.Provider>,
    );
    const username = MessageMockedProps.message.author.username;
    const messageContainer = screen.getByText(username);

    expect(messageContainer).toHaveClass('text-light');
  });

  it('renders username without text-light class if colorMap is declared', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.author.id = 1;
    const mockedUser = Object.assign({}, UserMock);
    mockedUser.id = 2;
    render(
      <AuthContext.Provider value={mockedUser}>
        <ChatContext.Provider value={{ colorMap: { 1: 'success' } }}>
          <Message {...mockedProps} />
        </ChatContext.Provider>
      </AuthContext.Provider>,
    );
    const username = MessageMockedProps.message.author.username;
    const messageContainer = screen.getByText(username);

    expect(messageContainer).not.toHaveClass('text-light');
  });

  it('set new colorMap when user ID is not in colorMap', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.author.id = 1;
    const mockedUser = Object.assign({}, UserMock);
    mockedUser.id = 2;
    const colorMap = {};
    render(
      <AuthContext.Provider value={mockedUser}>
        <ChatContext.Provider value={{ colorMap }}>
          <Message {...mockedProps} />
        </ChatContext.Provider>
      </AuthContext.Provider>,
    );

    expect(colorMap).toHaveProperty('1');
  });

  it('sets title if roll if given on message props', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.roll = { '1d20': [12], '4d6': [2, 1, 4, 3] };
    render(
      <AuthContext.Provider value={UserMock}>
        <Message {...mockedProps} />
      </AuthContext.Provider>,
    );

    expect(screen.getByTitle('1d20: [12], 4d6: [2,1,4,3]')).toBeInTheDocument();
  });
});
