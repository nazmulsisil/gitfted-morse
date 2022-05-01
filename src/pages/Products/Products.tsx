import * as React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { Button } from 'components/Button';
import { ProductList } from 'components/ProductList';
import { Form } from 'components/Form';
import logo from 'images/droppe-logo.png';
import img1 from 'images/img1.png';
import img2 from 'images/img2.png';
import styles from './Products.module.css';
import { API } from 'constants/api';
import { IS_TEST, PRODUCT_PROPOSAL_ERROR_MESSAGE } from 'constants/app';
import classNames from 'classnames';
import { ProductItem } from 'components/ProductList/Product';

interface ResponseProduct {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

class Products extends React.Component<
  {},
  {
    products: ProductItem[];
    isOpen: boolean;
    isShowingMessage: boolean;
    message: string;
    numFavorites: number;
    prodCount: number;
    loading: boolean;
    error: boolean;
  }
> {
  constructor(props: {}) {
    super(props);

    this.favClick = this.favClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      products: [],
      isOpen: false,
      isShowingMessage: false,
      message: '',
      numFavorites: 0,
      prodCount: 0,
      loading: true,
      error: false
    };
  }

  componentDidMount() {
    document.title = 'Droppe refactor app';

    fetch(API.products)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not OK');
        }

        return res.json();
      })
      .then((products: ResponseProduct[]) => {
        this.setState({
          products,
          prodCount: products.length,
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true
        });
      });
  }

  favClick(id: number, favorite: boolean) {
    const updated = [...this.state.products].map((product) =>
      product.id === id ? { ...product, isFavorite: favorite } : product
    );

    this.setState({
      products: updated,
      numFavorites: this.state.numFavorites + (favorite ? 1 : -1)
    });
  }

  onSubmit(payload: { title: string; description: string; price: string }) {
    this.setState({
      isOpen: false,
      isShowingMessage: true,
      message: 'Adding product...'
    });

    // **this POST request doesn't actually post anything to any database**
    fetch(API.products, {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        price: payload.price,
        description: payload.description
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not OK');
        }

        return res.json();
      })
      .then(({ id }: { id: number }) => {
        this.setState((prevState) => ({
          products: [{ ...payload, id }, ...prevState.products],
          prodCount: prevState.prodCount + 1,
          isShowingMessage: false,
          message: ''
        }));
      })
      .catch(() => {
        this.setState({
          message: PRODUCT_PROPOSAL_ERROR_MESSAGE
        });
      });
  }

  render() {
    const {
      header,
      container,
      headerImageWrapper,
      headerImage,
      main,
      heroImageContainer,
      heroImage,
      noPaddingTop,
      buttonWrapper,
      messageContainer,
      statsContainer,
      reactModalContent,
      reactModalOverlay,
      modalContentHelper,
      modalClose
    } = styles;

    const { products, isOpen, isShowingMessage, message, prodCount, numFavorites, loading, error } = this.state;

    const showProducts = !loading && !error && products?.length > 0;
    const noProductFound = !loading && !error && products?.length === 0;
    const showError = !loading && !showProducts && !noProductFound;

    return (
      <div className={styles.productsContainer}>
        <div className={header}>
          <div className={classNames(container, headerImageWrapper)}>
            <img alt="Brand logo" src={logo} className={headerImage} />
          </div>
        </div>

        <span className={classNames(container, main, heroImageContainer)}>
          <img alt="Two person working in the factory" src={img1} className={heroImage} />
          <img alt="IT personnel working in the workplace" src={img2} className={heroImage} />
        </span>

        <div className={classNames(container, main, noPaddingTop)}>
          <div className={buttonWrapper}>
            <Button
              testid="send-product-proposal"
              onClick={() =>
                this.setState({
                  isOpen: true
                })
              }
            >
              Send product proposal
            </Button>

            {isShowingMessage && (
              <div data-testid="product-message" className={messageContainer}>
                <i>{message}</i>
              </div>
            )}
          </div>

          <div className={statsContainer}>
            <span data-testid="product-count">Total products: {prodCount}</span>
            {' - '}
            <span data-testid="favorites-count">Number of favorites: {numFavorites}</span>
          </div>

          {loading && <div>loading...</div>}
          {noProductFound && <div data-testid="no-product-found">No products found!</div>}
          {showProducts && <ProductList products={products} onFav={this.favClick} />}
          {showError && <div data-testid="product-fetch-failed">Something went wrong!</div>}
        </div>

        {/* 
        FIXME: react-modal support for React 18 has been done but seems type issue is still there. We need to revisit https://github.com/reactjs/react-modal/issues/937#issuecomment-1111463879
        // @ts-ignore */}
        <Modal
          isOpen={isOpen}
          className={reactModalContent}
          overlayClassName={reactModalOverlay}
          ariaHideApp={!IS_TEST}
        >
          <div className={modalContentHelper}>
            <div
              className={modalClose}
              onClick={() => {
                this.setState({
                  isOpen: false
                });
              }}
            >
              <FaTimes />
            </div>

            <Form on-submit={this.onSubmit} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Products;
