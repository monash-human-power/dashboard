import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from 'react-bootstrap';

/**
 * @typedef {object} LabelledControlProps
 * @property {string}           label Label to display above control
 * @property {?string|boolean}  error Shows error message if true, or custom message if string
 */

/**
 * Form control with label and error message
 *
 * @param {LabelledControlProps} props Props
 * @param {React.MutableRefObject} ref Ref
 * @returns {React.RefForwardingComponent} Component
 */
function LabelledControl({ label, error, ...props }, ref) {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        ref={ref}
        className={classNames(error && 'is-invalid')}
        {...props}
      />
      {error ? (
        <Form.Control.Feedback type="invalid">
          {typeof error === 'string' ? error : `${label} is invalid`}
        </Form.Control.Feedback>
      ) : null}
    </Form.Group>
  );
}

LabelledControl.displayName = 'LabelledControl';

LabelledControl.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

LabelledControl.defaultProps = {
  error: null,
};

export default React.forwardRef(LabelledControl);
