import React, { useState } from 'react';

const ToggleSwitch = ({ onChange,status }) => {
  const [isChecked, setIsChecked] = useState(status);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue ? 1 : 0); 
  };

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;
