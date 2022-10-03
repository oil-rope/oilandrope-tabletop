import React from 'react';
import { render, screen } from '@testing-library/react';

import App from '@Components/App';

describe('App suite', () => {
  test('renders correctly', async () => {
    render(<App />);

    const loginModal = await screen.findByText('Authentication required');
    expect(loginModal).toBeInTheDocument();
  });
});
