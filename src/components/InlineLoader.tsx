import React, { useEffect, useState } from 'react';
import 'material-design-icons/iconfont/material-icons.css';

import '../css/inlineLoader.css';

const rotationStep = 36;

function InlineLoader() {
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setRotation((prevRotation) => (prevRotation + rotationStep) % 360);
    }, 125);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const rotationStyle = `rotate(${rotation}deg)`;
  const style = {
    transform: rotationStyle,
    msTransform: rotationStyle,
  };
  return (
    <div className="inline-loader" style={style}>
      <i className="inline-loader__icon spin-animation material-icons">
        &#xE863;
      </i>
    </div>
  );
}

export default InlineLoader;
