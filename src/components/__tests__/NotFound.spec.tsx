import React from 'react';
import { render, screen } from '@testing-library/react';

import NotFound from '../NotFound';
import { faker } from '@faker-js/faker';

describe('NotFound suite', () => {
  test('renders correctly', async () => {
    render(<NotFound />);

    const goBackElement = await screen.findByText('Go back to Oil & Rope');
    expect(goBackElement).toBeInTheDocument();
  });

  test('renders correctly with given message', async () => {
    const msg = faker.lorem.sentence();

    render(<NotFound message={msg} />);
    const msgElement = await screen.findByText(msg);
    expect(msgElement).toBeInTheDocument();
  });
});
