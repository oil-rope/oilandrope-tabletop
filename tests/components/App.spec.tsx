import React from 'react';
import { render } from '@testing-library/react';

import App from '@Components/App';

describe('App suite', () => {
  it('renders correctly', () => {
    const { container } = render(<App />);

    expect(container).toBeInTheDocument();
  });
});
