import * as React from 'react';
import lodash from 'lodash';
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
import { IS_TEST } from 'constants/app';
import classNames from 'classnames';

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
    products: any[];
    isOpen: boolean;
    isShowingMessage: boolean;
    message: string;
    numFavorites: number;
    prodCount: number;
  }
> {
  constructor(props: any) {
    super(props);

    this.favClick = this.favClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      products: [],
      isOpen: false,
      isShowingMessage: false,
      message: '',
      numFavorites: 0,
      prodCount: 0
    };
  }

  componentDidMount() {
    document.title = 'Droppe refactor app';

    fetch(API.products)
      .then((response) => response.json())
      .then((products: ResponseProduct[]) => {
        this.setState({
          products,
          prodCount: products.length
        });
      });
  }

  favClick(title: string) {
    const prods = this.state.products;
    const idx = lodash.findIndex(prods, { title: title });
    let currentFavs = this.state.numFavorites;
    let totalFavs: any;

    if (prods[idx].isFavorite) {
      prods[idx].isFavorite = false;
      totalFavs = --currentFavs;
    } else {
      totalFavs = ++currentFavs;
      prods[idx].isFavorite = true;
    }

    this.setState(() => ({ products: prods, numFavorites: totalFavs }));
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
      .then((res) => res.json())
      .then(({ id }: Partial<ResponseProduct>) => {
        this.setState((prevState) => ({
          products: [...prevState.products, { id, ...payload }],
          prodCount: prevState.prodCount + 1,
          isShowingMessage: false,
          message: ''
        }));
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

    const { products, isOpen, isShowingMessage, message, prodCount, numFavorites } = this.state;

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
            <span role="button">
              <Button
                testid="send-product-proposal"
                onClick={function (this: any) {
                  this.setState({
                    isOpen: true
                  });
                }.bind(this)}
              >
                Send product proposal
              </Button>
            </span>
            {isShowingMessage && (
              <div className={messageContainer}>
                <i>{message}</i>
              </div>
            )}
          </div>

          <div className={statsContainer}>
            <span data-testid="product-count">Total products: {prodCount}</span>
            {' - '}
            <span data-testid="favorites-count">Number of favorites: {numFavorites}</span>
          </div>

          {products && !!products.length ? <ProductList products={products} onFav={this.favClick} /> : <div></div>}
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
              onClick={function (this: any) {
                this.setState({
                  isOpen: false
                });
              }.bind(this)}
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
