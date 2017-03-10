import React from 'react'

export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    navigateToCitySelector(e) {
        e.preventDefault();
        this.context.router.push('/');
    },

    render() {
        return <div>
            <button type="button" onClick={this.navigateToCitySelector}>Back</button>
            <div>{this.props.params.cityName} Forecast</div>
        </div>
    }
})
