import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from "react-bootstrap";

/**
 * @typedef {object} IndicatorProps
 * @property {string}           variant     Variant of indicator
 * @property {React.ReactNode}  children  Children
 */

/**
 * General indicator
 *
 * @param {IndicatorProps} props Props
 * @returns {React.Component<IndicatorProps>} Component
 */
export default function Indicator({ variant, children }) {
    return <Badge pill variant={variant}>{children}</Badge>;
};

Indicator.propTypes = {
    variant: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
