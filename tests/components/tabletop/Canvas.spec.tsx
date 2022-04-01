import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Canvas from '@Components/tabletop/Canvas';

describe('App suite', () => {
  it('renders correctly', () => {
    const { container } = render(<Canvas width={100} height={200} />);

    expect(container).toBeInTheDocument();
  });

  it('draws lines', () => {
    const { container } = render(<Canvas width={100} height={200} />);
    fireEvent.mouseDown(container);
    fireEvent.mouseMove(container, {
      clientX: 100,
      clientY: 200,
    });
    fireEvent.mouseUp(container);
  });
});
