import * as React from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './ProductList.module.css';
import { formatPrice } from 'utils/formatPrice';
import classNames from 'classnames';
import { Button } from 'components/Button';

export interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: string;
  isFavorite?: boolean;
  rating?: { rate: number; count: number };
}

export type OnFav = (id: number, favorite: boolean) => void;

export const Product: React.FC<{
  product: ProductItem;
  onFav: OnFav;
}> = ({ product, onFav }) => {
  const {
    product: productClass,
    productBody,
    actionBarItem,
    actionBarItemLabel,
    productListItem,
    productTitle,
    actionBar
  } = styles;

  const { title, rating, price, description, isFavorite, id } = product;

  return (
    <span data-testid="product-list-item" className={classNames(productListItem, productClass)}>
      <span data-testid="product-title" className={productTitle}>
        {title}
      </span>

      <p>
        <strong>Rating: {rating ? `${rating.rate}/5` : ''}</strong>
      </p>

      <p data-testid="product-price">
        <b>Price: {formatPrice(price)}</b>
      </p>

      <p data-testid="product-description" className={productBody}>
        <span>
          <b>Description:</b>
        </span>
        <br />
        {description}
      </p>

      <span className={actionBar}>
        <Button
          className={classNames(actionBarItem, {
            active: isFavorite
          })}
          onClick={() => {
            onFav(id, !isFavorite);
          }}
        >
          <FaStar />{' '}
          <span data-testid="add-remove-favorites" className={actionBarItemLabel}>
            {!!isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </span>
        </Button>
      </span>
    </span>
  );
};
