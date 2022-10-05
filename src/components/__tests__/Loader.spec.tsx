import React from 'react';
import { render, screen } from '@testing-library/react';

import Loader from '@Components/Loader';
import { faker } from '@faker-js/faker';

describe('Loader Test Suite', () => {
  test('it renders Loader correctly', () => {
    render(<Loader />);
  });

  test('it renders with given test', async () => {
    const text = faker.lorem.sentence();
    render(<Loader text={text} />);

    await screen.findAllByText(text);
  });
});
