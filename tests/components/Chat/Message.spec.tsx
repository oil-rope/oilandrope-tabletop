import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AuthContext } from '@Contexts';

import { MessageMock, UserMock } from '../../__mocks__/helper';

import Message from '@Components/Chat/Message';

const MessageMockedProps = {
  message: MessageMock,
  colWidthMD: 10,
  colWidthXS: 8,
};

describe('Message suite', () => {
  it('renders correctly', () => {
    const { container } = render(<Message {...MessageMockedProps} />);

    expect(container).toBeInTheDocument();
  });

  it('renders message correctly', () => {
    const { getByText } = render(
      <AuthContext.Provider value={UserMock}>
        <Message {...MessageMockedProps} />
      </AuthContext.Provider>,
    );

    expect(getByText(MessageMock.message)).toBeInTheDocument();
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
    const { getByRole } = render(
      <AuthContext.Provider value={mockedUser}>
        <Message {...mockedProps} />
      </AuthContext.Provider>,
    );
    const messageContainer = getByRole('container');

    expect(messageContainer).toHaveClass('bg-secondary');
  });

  it('have primary color if author is not user', () => {
    const mockedProps = Object.assign({}, MessageMockedProps);
    mockedProps.message.author.id = 1;
    const mockedUser = Object.assign({}, UserMock);
    mockedUser.id = 2;
    const { getByRole } = render(
      <AuthContext.Provider value={mockedUser}>
        <Message {...mockedProps} />
      </AuthContext.Provider>,
    );
    const messageContainer = getByRole('container');

    expect(messageContainer).toHaveClass('bg-primary');
  });
});
