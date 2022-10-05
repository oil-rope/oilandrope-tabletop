import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { authRender } from './testUtils';

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { campaignMock } from '@/__mocks__';

import Tabletop from '../Tabletop';

let divContainer: HTMLElement | null = null;

beforeAll(() => {
  window.alert = jest.fn();
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
      'Loading campaign...',
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
    fetchMock.mockIf(/\/oarapi\//, (req) => {
      if (req.url.match(/\/roleplay\/campaign\/\d+/)) {
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

    authRender(
      <MemoryRouter initialEntries={[campaignURL]}>
        <Routes>
          <Route path="/campaign/:campaignID" element={<Tabletop />} />
        </Routes>
      </MemoryRouter>,
      { container: divContainer },
    );

    // Calls once for campaign and then for getting messages
    await waitFor(() => expect(fetchMock).toBeCalledTimes(2));

    // NOTE: Since the URL used is valid the WebSocket instance will be created but not used
    const inputElement = await screen.findByPlaceholderText('Start typing...');
    expect(inputElement).toBeInTheDocument();
  });
});
