import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { SessionContext } from '@Contexts';

import Tabletop from '@Components/Tabletop';

import { SessionMock } from '../__mocks__/helper';

beforeAll(() => {
  enableFetchMocks();
});

describe('Tabletop suite', () => {
  it('renders correctly', () => {
    const { container } = render(<Tabletop />);

    expect(container).toBeInTheDocument();
  });

  it('renders correctly with null session', () => {
    const { container } = render(
      <SessionContext.Provider value={null}>
        <Tabletop />
      </SessionContext.Provider>,
    );

    expect(container).toBeInTheDocument();
  });

  it('gets session on load', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(SessionMock));

    render(
      <MemoryRouter initialEntries={[`/sessions/${SessionMock.id}`]}>
        <Routes>
          <Route path="/sessions/:sessionID" element={<Tabletop />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findAllByText('Connecting chat...')).toHaveLength(2);

    expect(fetchMock).toBeCalledTimes(2);
  });
});
