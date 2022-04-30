import * as React from 'react';
import { Button } from 'components/Button';
import styles from './Form.module.css';

type FormProps = {
  'on-submit': (payload: { title: string; description: string; price: string }) => void;
};

const Form: React.FC<FormProps> = (props) => {
  let formRef = React.useRef<HTMLFormElement>(null);
  let titleRef = React.useRef<HTMLInputElement>(null);
  let priceRef = React.useRef<HTMLInputElement>(null);
  let descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!titleRef.current?.value) {
      alert('Your product needs a title');

      return;
    }

    if (!descriptionRef.current?.value || !priceRef.current?.value) {
      alert('Your product needs some content');

      return;
    }

    props['on-submit']({
      title: titleRef.current && titleRef.current.value,
      description: descriptionRef.current && descriptionRef.current.value,
      price: priceRef.current && priceRef.current.value
    });

    formRef.current?.reset();
  };

  return (
    <form
      data-testid="form-product-proposal"
      className={styles.form}
      onSubmit={(event) => handleSubmit(event)}
      ref={formRef}
    >
      <span className={styles.label}>Product title: *</span>

      <input
        data-testid="form-product-title"
        ref={titleRef}
        placeholder="Title..."
        defaultValue=""
        className={styles.input}
      />

      <span className={styles.label}>Product details: *</span>

      <input
        data-testid="form-product-price"
        ref={priceRef}
        placeholder="Price..."
        defaultValue=""
        className={styles.input}
      />

      <textarea
        data-testid="form-product-description"
        ref={descriptionRef}
        placeholder="Start typing product description here..."
        defaultValue=""
        className={styles.textarea}
      />

      <Button testid="submit-product-proposal">Add a product</Button>
    </form>
  );
};

export default Form;
