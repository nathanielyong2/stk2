import React from 'react';

const Stock = (props) => {
  let date1 = props.stk_date; // 20210101
  date1 = date1.slice(0, 4) + '-' + date1.slice(4, 6) + '-' + date1.slice(6); // 2021-01-01
  date1 = new Date(date1 + "T00:00:00").toDateString().split(' ').slice(1).join(' '); // Jan 01 2021
  const formattedDate = date1.slice(0, 6) + ',' + date1.slice(6); // Jan 01, 2021

  return (
    <tr>
        <td>{formattedDate}</td>
        <td>{props.open_price}</td>
        <td>{props.high_price}</td>
        <td>{props.low_price}</td>
        <td>{props.close_price}</td>
        <td>{props.volume.toLocaleString()}</td>
    </tr>
  );
};

export default Stock;
