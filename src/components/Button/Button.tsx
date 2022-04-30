import * as React from 'react';
import styles from './Button.module.css';

interface props {
  children: any;
  onClick?: () => void;
  testid?: string;
}

const Button: React.FC<props> = ({ children, onClick, testid }) => (
  <button className={styles.button} onClick={onClick} {...(testid ? { 'data-testid': testid } : {})}>
    {children}
  </button>
);

export default Button;
