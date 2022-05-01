import * as React from 'react';
import { OnFav, Product, ProductItem } from './Product';

interface IProductListProps {
  products: ProductItem[];
  onFav: OnFav;
}

export const ProductList = ({ products, onFav }: IProductListProps) => (
  <div data-testid="products-list-container">
    {products.map((product) => (
      <Product key={product.id} product={product} onFav={onFav} />
    ))}
  </div>
);

export default ProductList;
