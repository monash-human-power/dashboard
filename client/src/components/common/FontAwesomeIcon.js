import PropTypes from 'prop-types';
import React from 'react';
import styles from 'components/common/FontAwesomeIcon.module.css';

/**
 * @typedef {import('@fortawesome/fontawesome-common-types').IconDefinition} IconDefinition
 */

/**
 * @typedef {object} FontAwesomeIconProps
 * @property {IconDefinition} icon FontAwesome Icon
 */

/**
 * Lightweight FontAwesome icon component
 *
 * @example ```js
 * import { faLocationArrow } from '＠fortawesome/free-solid-svg-icons';
 * const LocationArrow = () => <FontAwesomeIcon icon={faLocationArrow} />
 * ```
 *
 * @param {FontAwesomeIconProps} props Props
 * @returns {JSX.Element} Component
 */
export default function FontAwesomeIcon({ icon }) {
  /*
  The recommended @fortawesome/react-fontawesome library includes ~30kB of polyfills in the bundle.
  This is a little excessive for embedding a couple of SVG icons. This component provides a
  lightweight alternative.
  */
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
    icon: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.string,
      ]),
    ).isRequired,
  }).isRequired,
};
