import React from 'react';
import { render } from '@testing-library/react';

import { SimpleUserMock } from '../../__mocks__/helper';
import Message from '@Components/Chat/Message';

const MessageMock = {
  id: 1,
  chat: 1,
  author: SimpleUserMock,
  message: 'Hello!',
  entry_created_at: '2022-01-01T09:00:00.000000Z',
  entry_updated_at: '2022-01-01T09:00:00.000000Z',
};

describe('Message suite', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Message message={MessageMock} />);

    expect(getByText(/Hello!/)).toBeInTheDocument();
  });
});
