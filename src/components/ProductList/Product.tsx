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

export const Product: React.FC<{
  product: ProductItem;
  onFav: (id: number) => void;
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

  return (
    <span data-testid="product-list-item" className={classNames(productListItem, productClass)}>
      <span data-testid="product-title" className={productTitle}>
        {product.title}
      </span>

      <p>
        <strong>Rating: {product.rating ? `${product.rating.rate}/5` : ''}</strong>
      </p>

      <p data-testid="product-price">
        <b>Price: {formatPrice(product.price)}</b>
      </p>

      <p data-testid="product-description" className={productBody}>
        <span>
          <b>Description:</b>
        </span>
        <br />
        {product.description}
      </p>

      <span className={actionBar}>
        <Button
          className={classNames(actionBarItem, {
            active: product.isFavorite
          })}
          onClick={() => {
            onFav(product.id);
          }}
        >
          <FaStar />{' '}
          <span data-testid="add-remove-favorites" className={actionBarItemLabel}>
            {!!!!product.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </span>
        </Button>
      </span>
    </span>
  );
};
