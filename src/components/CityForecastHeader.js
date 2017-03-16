import React from 'react'
import '../css/cityForecastHeader.css'

class CityForecastHeader extends React.Component {
    render() {
        return <h2 className="header">
            <button type="button" className="button-back" onClick={this.props.onBackClickHandler}><i className="material-icons">&#xE5C4;</i></button> {this.props.cityName}
        </h2>
    }
}

export default CityForecastHeader
