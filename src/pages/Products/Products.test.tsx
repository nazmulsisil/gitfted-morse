import * as React from 'react';
import { Products } from '.';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { API } from 'constants/api';

const server = setupServer(
  rest.get(API.products, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
          price: 109.95,
          description:
            'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
          category: "men's clothing",
          image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
          rating: { rate: 3.9, count: 120 }
        }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Products page', () => {
  test('Products should show after page loads', async () => {
    render(<Products />);
    await waitFor(() => screen.getByTestId('products-list-container'));
    expect(screen.getAllByTestId('product-list-item')).toHaveLength(1);
  });
});
