import React from 'react'
import '../css/cityForecastHeader.css'

class CityForecastHeader extends React.Component {
    render() {
        return <div className="header">
            <button type="button" className="button-back" onClick={this.props.onBackClickHandler}><i className="material-icons">&#xE5C4;</i></button> {this.props.cityName}
        </div>
    }
}

export default CityForecastHeader
