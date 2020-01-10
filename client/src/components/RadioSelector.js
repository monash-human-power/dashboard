import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useUID } from 'react-uid';
import FormCheck from 'react-bootstrap/FormCheck';

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
