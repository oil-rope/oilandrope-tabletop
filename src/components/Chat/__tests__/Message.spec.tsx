import React from 'react';
import { render, screen } from '@testing-library/react';

import { messageMock, userMock, botMock } from '@Mocks';

import { IBot, IChatMessage, IRoll, IUser } from '@Interfaces';
import { AuthContext } from '@Contexts';
import { ChatContext, ColorMapTypes } from '../context';

import { Message } from '@Components/Chat';
import { faker } from '@faker-js/faker';

let BotMock: IBot;
let UserMock: IUser;
/** This message will have the same author as 'UserMock'. */
let AuthorMessageMock: IChatMessage;
/** This message will have a random user that is not logged one */
let MessageMock: IChatMessage;
let BotMessageMock: IChatMessage;

beforeEach(() => {
  BotMock = botMock();
  UserMock = userMock();
  AuthorMessageMock = messageMock(UserMock);
  MessageMock = messageMock();
  const roll: IRoll = {
    '1d20': [faker.datatype.number({ min: 1, max: 20 })],
    '+4': [4],
    '-1': [-1],
  };
  BotMessageMock = messageMock(BotMock, roll);
});

describe('Chat/Message Test Suite', () => {
  test('renders Message correctly', () => {
    render(<Message message={AuthorMessageMock} />);
  });

  test("it doesn't render if user is not loaded", () => {
    render(<Message message={AuthorMessageMock} />);

    const messageElement = screen.queryByText(AuthorMessageMock.message);
    expect(messageElement).not.toBeInTheDocument();
  });

  test('renders correctly if user is given', async () => {
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <Message message={AuthorMessageMock} />
      </AuthContext.Provider>,
    );

    const messageElement = await screen.findByText(AuthorMessageMock.message);
    expect(messageElement).toBeInTheDocument();
  });

  test('renders with secondary color if message author is user', async () => {
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <Message message={AuthorMessageMock} />
      </AuthContext.Provider>,
    );

    // Since it will only be a message we can safely access that
    const messageElement = await screen.findByRole('message');
    expect(messageElement).toHaveClass('bg-secondary');
  });

  test('renders background with primary color if message author is not user', async () => {
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <Message message={MessageMock} />
      </AuthContext.Provider>,
    );

    // Since it will only be a message we can safely access that
    const messageElement = await screen.findByRole('message');
    expect(messageElement).toHaveClass('bg-primary');
  });

  test('renders with light background if author is bot', async () => {
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: BotMock }}>
        <Message message={BotMessageMock} />
      </AuthContext.Provider>,
    );

    // Since it will only be a message we can safely access that
    const messageElement = await screen.findByRole('message');
    expect(messageElement).toHaveClass('bg-light');
  });

  test('renders username with light text color if message author is user', async () => {
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <Message message={AuthorMessageMock} />
      </AuthContext.Provider>,
    );

    const usernameLabelElement = await screen.findByText(
      AuthorMessageMock.author.username,
    );
    expect(usernameLabelElement).toHaveClass('text-light');
  });

  test('renders username with light text color if message author is not user and colorMap is not declared', async () => {
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <Message message={MessageMock} />
      </AuthContext.Provider>,
    );

    const usernameLabelElement = await screen.findByText(
      MessageMock.author.username,
    );
    expect(usernameLabelElement).toHaveClass('text-light');
  });

  test('renders username with random color not light if message author is not user and colorMap is declared but empty', async () => {
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <ChatContext.Provider value={{ colorMap: {} }}>
          <Message message={MessageMock} />
        </ChatContext.Provider>
      </AuthContext.Provider>,
    );

    const usernameLabelElement = await screen.findByText(
      MessageMock.author.username,
    );
    expect(usernameLabelElement).not.toHaveClass('text-light');
  });

  test('renders username with given color in colorMap and author is not user', async () => {
    // We have to make to much work-around it doesn't even make sense
    const colorMap = {} as ColorMapTypes;
    colorMap[MessageMock.author.id] = 'success';

    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <ChatContext.Provider value={{ colorMap }}>
          <Message message={MessageMock} />
        </ChatContext.Provider>
      </AuthContext.Provider>,
    );

    const usernameLabelElement = await screen.findByText(
      MessageMock.author.username,
    );
    expect(usernameLabelElement).toHaveClass('text-success');
  });

  test('renders roll in title for bot messages', async () => {
    const expectedTitle = Object.entries(BotMessageMock.roll as IRoll)
      .map(([key, value]) => `${key}: [${value}]`)
      .join(', ');

    render(
      <AuthContext.Provider value={{ user: UserMock, bot: BotMock }}>
        <Message message={BotMessageMock} />
      </AuthContext.Provider>,
    );

    const messageElement = screen.getByTitle(expectedTitle);
    expect(messageElement).toBeInTheDocument();
  });
});
