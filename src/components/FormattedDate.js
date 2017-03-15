import React from 'react';
import moment from 'moment';

class FormattedDate extends React.Component {
    render() {
        const props = this.props;
        if (!props) {
            return;
        }

        const date = props.of;
        if (!date) {
            return;
        }

        let format = 'dddd, MMMM Do YYYY';
        if (props.format === 'short') {
            format = 'dddd';
        }

        return (
            <div className="formatted-date">{moment.unix(date - 1).utc().format(format)}</div>
        );
    }
}

export default FormattedDate;
