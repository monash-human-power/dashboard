import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';
import styles from './WidgetListItem.module.css';

export default function WidgetListItem({ title, children, ...props }) {
  return (
    <>
      <ListGroupItem className={styles.item} {...props}>
        {title}
        {children}
      </ListGroupItem>
    </>
  );
}

WidgetListItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
