import React from 'react'

export default React.createClass({
    render() {
        return <div>
            <div>{this.props.params.cityName} Forecast</div>
        </div>
    }
})
