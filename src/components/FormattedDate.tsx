import React from 'react';
import moment from 'moment';

interface FormattedDateProps {
  of: number;
  format?: string;
}

function FormattedDate({ of: date, format }: FormattedDateProps) {
  let dateFormat = 'dddd, MMMM Do YYYY';
  if (format === 'short') {
    dateFormat = 'dddd';
  }

  return (
    <span>
      {moment
        .unix(date - 1)
        .utc()
        .format(dateFormat)}
    </span>
  );
}

export default FormattedDate;
