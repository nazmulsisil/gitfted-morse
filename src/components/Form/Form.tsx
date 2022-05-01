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

  const { form, input, label, textarea, error } = styles;

  return (
    <form data-testid="form-product-proposal" className={form} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="form-product-title" className={label}>
        Product title: *
      </label>

      <input
        id="form-product-title"
        data-testid="form-product-title"
        placeholder="Title..."
        defaultValue=""
        className={input}
        {...register('title', { required: true })}
      />
      <div className={error}>{errors?.title?.type === 'required' && <span>Your product needs a title</span>}</div>

      <label htmlFor="form-product-price" className={label}>
        Product details: *
      </label>

      <input
        data-testid="form-product-price"
        id="form-product-price"
        placeholder="Price..."
        defaultValue=""
        className={input}
        {...register('price', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
      />
      <div className={error}>
        {errors?.price?.type === 'required' && <span>Your product needs a price</span>}
        {errors?.price?.type === 'pattern' && <span>Please provide a valid price, e.g. 10.85</span>}
      </div>

      <textarea
        data-testid="form-product-description"
        placeholder="Start typing product description here..."
        defaultValue=""
        className={textarea}
        {...register('description', { required: true })}
      />
      <div className={error}>
        {errors?.description?.type === 'required' && <span>Your product needs some content</span>}
      </div>

      <Button testid="submit-product-proposal">Add a product</Button>
    </form>
  );
};

export default Form;
