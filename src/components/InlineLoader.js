import React from 'react'
import 'material-design-icons/iconfont/material-icons.css'
import '../css/inlineLoader.css'

class InlineLoader extends React.Component {
    render() {
        return <div className="inline-loader"><i className="spin-animation material-icons">&#xE863;</i></div>
    }
}

export default InlineLoader;
