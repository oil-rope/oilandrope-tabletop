import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Loader from '@Components/Loader';

describe('Loader suite', () => {
  it('renders with default text', async () => {
    const { findAllByText } = render(<Loader />);
    const loadingTexts = await findAllByText('Loading...');

    expect(loadingTexts.length).toBe(2);
  });

  it('renders with given text', async () => {
    const givenText = 'Loading something...';
    const { findAllByText } = render(<Loader text={givenText} />);
    const loadingTexts = await findAllByText(givenText);

    expect(loadingTexts.length).toBe(2);
  });
});
