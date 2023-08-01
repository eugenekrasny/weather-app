import React from 'react';

import '../../../css/unitsSwitch.css';

interface UnitsSwitchProps {
  checked: boolean;
  onChangeHandler: () => void;
}

function UnitsSwitch({ checked, onChangeHandler }: UnitsSwitchProps) {
  return (
    <label className="switch">
      <input className="switch__input" type="checkbox" onChange={onChangeHandler} checked={checked} />
      <span className="switch__slider"></span>
      <span className="switch__label"></span>
    </label>
  );
}

export default UnitsSwitch;
