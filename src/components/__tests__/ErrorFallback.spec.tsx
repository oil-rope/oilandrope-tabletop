import React from 'react';
import { render, screen } from '@testing-library/react';

import { faker } from '@faker-js/faker';

import ErrorFallback from '../ErrorFallback';

describe('ErrorFallback suite', () => {
  test('renders correctly', async () => {
    render(
      <ErrorFallback error={new (jest.fn())()} resetErrorBoundary={jest.fn} />,
    );

    const tryAgainButton = await screen.findByText('Try again');
    expect(tryAgainButton).toBeInTheDocument();
  });

  test('renders with error message if given', async () => {
    const errorMsg = faker.lorem.sentence();
    render(
      <ErrorFallback
        error={new Error(errorMsg)}
        resetErrorBoundary={jest.fn}
      />,
    );

    const errorMsgElement = await screen.findByText(errorMsg);
    expect(errorMsgElement).toBeInTheDocument();
  });
});
