import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
    render() {
        return <div>
            <div>City Selection</div>
            <div><Link to="/forecast/Tallin">Tallin</Link></div>
        </div>
    }
})
