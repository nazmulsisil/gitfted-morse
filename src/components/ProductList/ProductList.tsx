import * as React from 'react';
import lodash from 'lodash';
import { FaStar } from 'react-icons/fa';
import styles from './ProductList.module.css';
import { formatPrice } from 'utils/formatPrice';
import classNames from 'classnames';

const Product: React.FC<{
  index: number;
  product: {
    title: string;
    description: string;
    price: number;
    isFavorite: boolean;
    rating: { rate: number; count: number };
  };
  onFav: (title: string) => void;
}> = ({ product, onFav }) => {
  const { product: productClass, productBody, actionBarItem, actionBarItemLabel } = styles;

  return (
    <span data-testid="product-list-item" className={classNames(styles.productListItem, productClass)}>
      <span data-testid="product-title" className={styles['product-title']}>
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

      <span className={styles['action_bar']}>
        <span
          className={`${actionBarItem} ${product.isFavorite ? 'active' : ''}`}
          role="button"
          onClick={() => {
            onFav(product.title);
          }}
        >
          <FaStar />{' '}
          <span data-testid="add-remove-favorites" className={actionBarItemLabel}>
            {!!!!product.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </span>
        </span>
      </span>
    </span>
  );
};

interface IProductListProps {
  products: any;
  onFav: (title: string) => void;
}

class ProductList extends React.Component<IProductListProps, {}> {
  render() {
    let productsarr = [];
    for (const [i, p] of this.props.products.entries()) {
      productsarr.push(<Product key={i} index={i} product={p} onFav={this.props.onFav} />);
    }
    return <div data-testid="products-list-container">{lodash.reverse(productsarr)}</div>;
  }
}

export default ProductList;
