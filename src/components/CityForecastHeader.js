import React from 'react'
import '../css/cityForecastHeader.css'

class CityForecastHeader extends React.Component {
    render() {
        return <div className="header">
            <i className="button-back material-icons" onClick={this.props.onBackClickHandler}>&#xE5C4;</i> <span>{this.props.cityName}</span>
        </div>
    }
}

export default CityForecastHeader
