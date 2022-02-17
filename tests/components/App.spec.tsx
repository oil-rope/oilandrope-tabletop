import React from 'react';
import { render } from '@testing-library/react';

import App from '@Components/App';

describe('App suite', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Oil & Rope/)).toBeInTheDocument();
  });
});
