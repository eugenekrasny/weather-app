import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
    render() {
        return <div>
            <div><Link to="/Tallinn">Tallinn</Link></div>
            <div><Link to="/Mykolayiv">Mykolayiv</Link></div>
            <div><Link to="/47/32">Mykolayiv coords</Link></div>
            <div><Link to="/1111111">Error City</Link></div>
        </div>
    }
})
