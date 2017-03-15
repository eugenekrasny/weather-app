import React from 'react'
import '../css/unitsSwitch.css'

class Switch extends React.Component {
    render() {
        return <label className="switch">
            <input type="checkbox" onChange={this.props.onChangeHandler} checked={this.props.checked} />
            <span className="slider"></span>
            <span className="switch-label"></span>
        </label>
    }
}

export default Switch
