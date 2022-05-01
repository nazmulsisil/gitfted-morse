import classNames from 'classnames';
import * as React from 'react';
import styles from './Button.module.css';

interface props {
  children: React.ReactNode;
  onClick?: () => void;
  testid?: string;
  className?: string;
}

const Button: React.FC<props> = ({ children, onClick, testid, className }) => (
  <button
    className={classNames(styles.button, className)}
    onClick={onClick}
    {...(testid ? { 'data-testid': testid } : {})}
  >
    {children}
  </button>
);

export default Button;
