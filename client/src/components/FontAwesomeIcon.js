import React from 'react';
import PropTypes from 'prop-types';
import styles from './FontAwesomeIcon.module.css';

/**
 * @typedef {import('@fortawesome/fontawesome-common-types').IconDefinition} IconDefinition
 */

/**
 * @typedef {object} FontAwesomeIconProps
 * @property {IconDefinition} icon Icon
 */

/**
 * Lightweight FontAwesome icon component
 *
 * @param {FontAwesomeIconProps} props Props
 * @returns {React.Component<FontAwesomeIconProps>} Component
 */
export default function FontAwesomeIcon({ icon }) {
  const [width, height] = icon.icon;
  const svgPathData = icon.icon[4];
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <svg viewBox={viewBox} className={styles.icon}>
      <path d={svgPathData} />
    </svg>
  );
}

FontAwesomeIcon.propTypes = {
  icon: PropTypes.shape({
    prefix: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    icon: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.array,
      PropTypes.string,
    ])).isRequired,
  }).isRequired,
};
