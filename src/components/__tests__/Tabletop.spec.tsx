import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import Tabletop from '../Tabletop';
import { campaignMock } from '@/__mocks__';

let divContainer: HTMLElement | null = null;

beforeAll(() => {
  jest.spyOn(window, 'alert');
});

beforeEach(() => {
  divContainer = document.createElement('div');
  document.body.appendChild(divContainer);
});

afterAll(() => {
  (alert as jest.Mock).mockReset();
});

afterEach(() => {
  unmountComponentAtNode(divContainer);
  divContainer.remove();
  divContainer = null;
});

describe('Tabletop suite without router', () => {
  test('renders correctly', async () => {
    render(<Tabletop />, { container: divContainer });

    const loadingChatElements = await screen.findAllByText(
      'Connecting chat...',
    );
    expect(loadingChatElements).toHaveLength(2);
  });
});

describe('Tabletop suite with react-router', () => {
  const CampaignMock = campaignMock();

  beforeAll(() => {
    enableFetchMocks();
  });

  beforeEach(() => {
    fetchMock.mockIf(/https?:\/\/oilandrope-project\.com\/api\//, (req) => {
      if (req.url.match(/\/roleplay\/campaign\/\d+$/)) {
        return Promise.resolve({
          body: JSON.stringify(CampaignMock),
          status: 200,
        });
      }
      return Promise.resolve({ body: 'Not found', status: 404 });
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test('loads campaign on render', async () => {
    const campaignURL = `/campaign/${CampaignMock.id}`;

    render(
      <MemoryRouter initialEntries={[campaignURL]}>
        <Routes>
          <Route path="/campaign/:campaignID" element={<Tabletop />} />
        </Routes>
      </MemoryRouter>,
      { container: divContainer },
    );

    await waitFor(() => expect(fetchMock).toBeCalledTimes(1));

    const loadingChatElements = await screen.findAllByText(
      'Connecting chat...',
    );
    expect(loadingChatElements).toHaveLength(2);
  });
});
