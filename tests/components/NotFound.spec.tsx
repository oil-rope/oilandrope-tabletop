import React from 'react';
import { render } from '@testing-library/react';

import NotFound from '@Components/NotFound';

describe('NotFound suite', () => {
  it('renders correctly', () => {
    const { container } = render(<NotFound />);

    expect(container).toBeInTheDocument();
  });

  it('renders with default text', () => {
    const { getByText } = render(<NotFound />);

    expect(
      getByText('The element you are looking for does not exist.'),
    ).toBeInTheDocument();
  });
});
