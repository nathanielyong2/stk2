import React from 'react';

import Stock from './Stock';
import './StockList.css';

const StockList = (props) => {
  return (
    <React.Fragment>
      <h1>{props.stocks[0].stk_name} ({props.stocks[0].stk})</h1>
      <span>{props.stocks[0].exch}</span>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {
            props.stocks.map((stock) => (
              <Stock
                key={stock.id}
                stk_date={stock.stk_date}
                open_price={stock.open_price}
                high_price={stock.high_price}
                low_price={stock.low_price}
                close_price={stock.close_price}
                volume={stock.volume}
              />
            ))
          }
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default StockList;
