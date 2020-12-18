import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import FormCheck from 'react-bootstrap/FormCheck';
import { useUID } from 'react-uid';

/**
 * @typedef {object} RadioSelectorProps
 * @property {string[]}         options   List of possible options
 * @property {string | null}           value     Selected option
 * @property {React.Dispatch<SetStateAction<null>>} onChange  On selected changed callback
 */

/**
 * Radio selector group component
 *
 * @param {RadioSelectorProps} props Props
 * @returns {JSX.Element} Component
 */
export default function RadioSelector({ options, value, onChange }) {
  const uid = useUID();

  const handleChange = useCallback(
    (event) => {
      onChange(event.currentTarget.value);
    },
    [onChange],
  );

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
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
