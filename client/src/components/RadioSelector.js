import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useUID } from 'react-uid';
import FormCheck from 'react-bootstrap/FormCheck';

/**
 * @typedef {object} RadioSelectorProps
 * @property {string[]}         options   List of possible options
 * @property {string}           value     Selected option
 * @property {function(string)} onChange  On selected changed callback
 */

/**
 * Radio selector group component
 *
 * @param {RadioSelectorProps} props Props
 * @returns {React.Component<RadioSelectorProps>} Component
 */
export default function RadioSelector({ options, value, onChange }) {
  const uid = useUID();

  const handleChange = useCallback((event) => {
    onChange(event.currentTarget.value);
  }, [onChange]);

  return options.map((option, index) => (
    <FormCheck
      type="radio"
      key={option}
      label={option}
      value={option}
      id={`RadioSelector-${uid}-${index}`}
      checked={value === option}
      onChange={handleChange}
    />
  ));
}

RadioSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

RadioSelector.defaultProps = {
  value: null,
};
