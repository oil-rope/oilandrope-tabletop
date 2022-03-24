import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { emptyFunc } from '../__mocks__/helper';

import ErrorFallback from '@Components/ErrorFallback';

const ErrorFallbackMockedProps = {
  error: new Error('Random error'),
  resetErrorBoundary: emptyFunc,
};

describe('ErrorFallback suite', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ErrorFallback {...ErrorFallbackMockedProps} />,
    );

    expect(container).toBeInTheDocument();
  });

  it('button launches reset func', () => {
    const resetErrorMock = jest.fn();
    const mockedProps = ErrorFallbackMockedProps;
    mockedProps.resetErrorBoundary = resetErrorMock;

    const { getByText } = render(<ErrorFallback {...mockedProps} />);
    fireEvent.click(getByText('Try again'));

    expect(resetErrorMock).toHaveBeenCalledTimes(1);
  });
});
