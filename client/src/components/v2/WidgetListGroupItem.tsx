import React from 'react';
import { ListGroupItem, ListGroupItemProps } from 'react-bootstrap';
import styles from 'components/v2/WidgetListGroupItem.module.css';

export interface WidgetListGroupItemProps extends ListGroupItemProps {
  /** Item display text */
  title: string;
  /** Widget */
  children?: React.ReactNode;
}

/**
 * List group item with embedded widget
 *
 * @param props Props
 * @returns Component
 */
export default function WidgetListGroupItem({
  title,
  children,
  ...props
}: WidgetListGroupItemProps) {
  return (
    <>
      <ListGroupItem className={styles.item} {...props}>
        {title}
        {children}
      </ListGroupItem>
    </>
  );
}
