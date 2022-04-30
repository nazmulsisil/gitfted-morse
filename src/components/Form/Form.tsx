import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from 'components/Button';
import styles from './Form.module.css';

type Inputs = {
  title: string;
  price: string;
  description: string;
};

type FormProps = {
  'on-submit': (payload: { title: string; description: string; price: string }) => void;
};

const Form: React.FC<FormProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = ({ title, description, price }) => {
    props['on-submit']({
      title,
      description,
      price
    });
    reset();
  };

  return (
    <form data-testid="form-product-proposal" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <span className={styles.label}>Product title: *</span>

      <input
        data-testid="form-product-title"
        placeholder="Title..."
        defaultValue=""
        className={styles.input}
        {...register('title', { required: true })}
      />
      <div className={styles.error}>
        {errors?.title?.type === 'required' && <span>Your product needs a title</span>}
      </div>

      <span className={styles.label}>Product details: *</span>

      <input
        data-testid="form-product-price"
        placeholder="Price..."
        defaultValue=""
        className={styles.input}
        {...register('price', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
      />
      <div className={styles.error}>
        {errors?.price?.type === 'required' && <span>Your product needs a price</span>}
        {errors?.price?.type === 'pattern' && <span>Please provide a valid price, e.g. 10.85</span>}
      </div>

      <textarea
        data-testid="form-product-description"
        placeholder="Start typing product description here..."
        defaultValue=""
        className={styles.textarea}
        {...register('description', { required: true })}
      />
      <div className={styles.error}>
        {errors?.description?.type === 'required' && <span>Your product needs some content</span>}
      </div>

      <Button testid="submit-product-proposal">Add a product</Button>
    </form>
  );
};

export default Form;
