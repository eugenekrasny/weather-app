import React from 'react';
import 'material-design-icons/iconfont/material-icons.css';
import '../css/inlineLoader.css';

class InlineLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      rotationStep: 36,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.rotate(), 125);
  }

  rotate() {
    this.setState((prevState, props) => {
      return {
        rotation: (prevState.rotation + prevState.rotationStep) % 360,
      };
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const rotation = 'rotate(' + this.state.rotation + 'deg)';
    const style = {
      transform: rotation,
      msTransform: rotation,
    };
    return (
      <div className="inline-loader" style={style}>
        <i className="spin-animation material-icons">&#xE863;</i>
      </div>
    );
  }
}

export default InlineLoader;
