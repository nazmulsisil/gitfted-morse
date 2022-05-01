import classNames from 'classnames';
import * as React from 'react';
import styles from './Button.module.css';

interface props {
  children: React.ReactNode;
  onClick?: () => void;
  testid?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: React.FC<props> = ({ children, onClick, testid, className, type }) => (
  <button
    type={type}
    className={classNames(styles.button, className)}
    onClick={onClick}
    {...(testid ? { 'data-testid': testid } : {})}
  >
    {children}
  </button>
);

export default Button;
