import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';
import styles from './WidgetListGroupItem.module.css';

/**
 * @typedef {object} WidgetListGroupItemProps
 * @property {string}           title     Item display text
 * @property {React.ReactNode}  children  Widget
 */

/**
 * List group item with embedded widget
 *
 * @param {WidgetListGroupItemProps} props Props
 * @returns {React.Component<WidgetListGroupItemProps>} Component
 */
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
