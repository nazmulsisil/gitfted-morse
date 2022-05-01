import * as React from 'react';
import { Products } from '.';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { API } from 'constants/api';
import { PRODUCT_PROPOSAL_ERROR_MESSAGE } from 'constants/app';

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
      ctx.json({
        id: 2
      })
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
    expect(screen.queryByTestId('product-fetch-failed')).toBeFalsy();
    expect(screen.getAllByTestId('product-list-item')).toHaveLength(1);
    expect(screen.getByTestId('product-count')).toHaveTextContent('Total products: 1');
  });

  test('Handle error on fetching products', async () => {
    server.use(
      rest.get(API.products, (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Products />);
    await waitFor(() => screen.getByTestId('product-fetch-failed'));
  });

  test('Modal should open after clicking "Send product proposal" button', () => {
    render(<Products />);
    fireEvent.click(screen.getByTestId('send-product-proposal'));
    expect(screen.getByTestId('form-product-proposal')).toBeVisible();
  });

  test('Successfully send product proposal with correct title, price and description', async () => {
    // Load product list
    render(<Products />);
    await waitFor(() => screen.getByTestId('products-list-container'));

    // Click button for sending product proposal
    fireEvent.click(screen.getByTestId('send-product-proposal'));

    // Expect form to appear
    const productForm = screen.getByTestId('form-product-proposal');
    expect(productForm).toBeVisible();

    // Input the values in the form fields
    fireEvent.change(within(productForm).getByTestId('form-product-title'), { target: { value: TITLE } });
    fireEvent.change(within(productForm).getByTestId('form-product-price'), { target: { value: PRICE } });
    fireEvent.change(within(productForm).getByTestId('form-product-description'), { target: { value: DESCRIPTION } });
    fireEvent.click(within(productForm).getByTestId('submit-product-proposal'));

    // Form should disappear
    await waitFor(() => expect(productForm).not.toBeVisible());

    // UI should be updated with correct values
    await waitFor(() => expect(screen.getAllByTestId('product-list-item')).toHaveLength(2));
    expect(screen.getByTestId('product-count')).toHaveTextContent('Total products: 2');

    // newly added product should appear in the first position
    const firstProduct = screen.getAllByTestId('product-list-item')[0];
    expect(within(firstProduct).getByTestId('product-title')).toHaveTextContent(TITLE);
    expect(within(firstProduct).getByTestId('product-price')).toHaveTextContent(PRICE);
    expect(within(firstProduct).getByTestId('product-description')).toHaveTextContent(DESCRIPTION);
  });

  test('Handle error on sending product proposal', async () => {
    server.use(
      rest.post(API.products, (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Products />);
    await waitFor(() => screen.getByTestId('products-list-container'));

    // Click button for sending product proposal
    fireEvent.click(screen.getByTestId('send-product-proposal'));

    // Expect form to appear
    const productForm = screen.getByTestId('form-product-proposal');
    expect(productForm).toBeVisible();

    // Input the values in the form fields
    fireEvent.change(within(productForm).getByTestId('form-product-title'), { target: { value: TITLE } });
    fireEvent.change(within(productForm).getByTestId('form-product-price'), { target: { value: PRICE } });
    fireEvent.change(within(productForm).getByTestId('form-product-description'), { target: { value: DESCRIPTION } });
    fireEvent.click(within(productForm).getByTestId('submit-product-proposal'));

    // Form should disappear
    await waitFor(() => expect(productForm).not.toBeVisible());

    await waitFor(() =>
      expect(screen.getByTestId('product-message')).toHaveTextContent(PRODUCT_PROPOSAL_ERROR_MESSAGE)
    );
  });

  test('Add to favorites should update UI correctly', async () => {
    // Load product list
    render(<Products />);
    await waitFor(() => screen.getByTestId('products-list-container'));

    // UI should show correct counts
    expect(screen.getAllByTestId('product-list-item')).toHaveLength(1);
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Number of favorites: 0');

    // UI should show updated counts
    fireEvent.click(screen.getByTestId('add-remove-favorites'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Number of favorites: 1');

    // UI should show updated counts
    fireEvent.click(screen.getByTestId('add-remove-favorites'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Number of favorites: 0');
  });
});
