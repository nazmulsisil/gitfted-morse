import * as React from 'react';
import { Products } from '.';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { API } from 'constants/api';

const TITLE = "Women's t-shirt";
const PRICE = '12.24';
const DESCRIPTION = 'Lorem impus dolor imet';

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
  }),
  rest.post(API.products, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: TITLE,
          price: PRICE,
          description: DESCRIPTION,
          category: "men's clothing",
          image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
          rating: { rate: 3.9, count: 120 }
        }
      ])
    );
  })
);

describe('Products page', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('Products should show after page loads', async () => {
    render(<Products />);
    await waitFor(() => screen.getByTestId('products-list-container'));
    expect(screen.getAllByTestId('product-list-item')).toHaveLength(1);
    expect(screen.getByTestId('product-count')).toHaveTextContent('Total products: 1');
  });

  test('Modal should open after clicking "Send product proposal" button', () => {
    render(<Products />);
    fireEvent.click(screen.getByTestId('send-product-proposal'));
    expect(screen.getByTestId('form-product-proposal')).toBeVisible();
  });

  test('Successfully send product proposal with correct title, price and description', async () => {
    render(<Products />);

    await waitFor(() => screen.getByTestId('products-list-container'));

    fireEvent.click(screen.getByTestId('send-product-proposal'));

    const productForm = screen.getByTestId('form-product-proposal');
    expect(productForm).toBeVisible();

    fireEvent.change(within(productForm).getByTestId('form-product-title'), { target: { value: TITLE } });
    fireEvent.change(within(productForm).getByTestId('form-product-price'), { target: { value: PRICE } });
    fireEvent.change(within(productForm).getByTestId('form-product-description'), { target: { value: DESCRIPTION } });
    fireEvent.click(within(productForm).getByTestId('submit-product-proposal'));

    await waitFor(() => expect(productForm).not.toBeVisible());

    expect(screen.getAllByTestId('product-list-item')).toHaveLength(2);
    expect(screen.getByTestId('product-count')).toHaveTextContent('Total products: 2');

    const firstProduct = screen.getAllByTestId('product-list-item')[0];

    expect(within(firstProduct).getByTestId('product-title')).toHaveTextContent(TITLE);
    expect(within(firstProduct).getByTestId('product-price')).toHaveTextContent(PRICE);
    expect(within(firstProduct).getByTestId('product-description')).toHaveTextContent(DESCRIPTION);
  });

  test('Add to favorites should update UI correctly', async () => {
    render(<Products />);
    await waitFor(() => screen.getByTestId('products-list-container'));
    expect(screen.getAllByTestId('product-list-item')).toHaveLength(1);
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Number of favorites: 0');

    fireEvent.click(screen.getByTestId('add-remove-favorites'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Number of favorites: 1');

    fireEvent.click(screen.getByTestId('add-remove-favorites'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Number of favorites: 0');
  });
});
