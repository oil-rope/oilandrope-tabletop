import React from 'react';
import { render, screen } from '@testing-library/react';

import Loader from '@Components/Loader';

describe('Loader suite', () => {
  it('renders with default text', async () => {
    render(<Loader />);
    const loadingTexts = await screen.findAllByText('Loading...');

    expect(loadingTexts.length).toBe(2);
  });

  it('renders with given text', async () => {
    const givenText = 'Loading something...';
    render(<Loader text={givenText} />);
    const loadingTexts = await screen.findAllByText(givenText);

    expect(loadingTexts.length).toBe(2);
  });
});
