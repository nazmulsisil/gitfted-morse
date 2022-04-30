import * as React from 'react';
import styles from './Button.module.css';

interface props {
  children: any;
  onClick?: () => void;
}

const Button: React.FC<props> = ({ children, onClick }) => (
  <button className={styles.button} onClick={onClick}>
    {children}
  </button>
);

export default Button;