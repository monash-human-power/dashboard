import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';
import styles from './WidgetListGroupItem.module.css';

export default function WidgetListGroupItem({ title, children, ...props }) {
  return (
    <>
      <ListGroupItem className={styles.item} {...props}>
        {title}
        {children}
      </ListGroupItem>
    </>
  );
}

WidgetListGroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
