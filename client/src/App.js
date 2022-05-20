import React, { useState, useRef } from 'react';
import './App.css';
import StockList from './components/StockList';

function App() {
  const stkRef = useRef('');
  const period1Ref = useRef('');
  const period2Ref = useRef('');

  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStkHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const period1 = period1Ref.current.value;
    const period2 = period2Ref.current.value;
    const stk = stkRef.current.value

    try {
      let response;
      if (period1 === '' && period2 === '') {
        response = await fetch(`/StkPrice/${stk}`);
      }
      else {
        if ((period1 === '' && period2 !== '') || (period2 === '' && period1 !== '')) {
          throw new Error('Invalid date input');
        }
        if (period1 > period2) {
          throw new Error("'Start' date must be prior to 'End' date.");
        }
        response = await fetch(`/StkPrice/${stk}/date?period1=${period1.replaceAll('-', '')}&period2=${period2.replaceAll('-', '')}`);
      }

      if (!response.ok) {
        throw new Error('An error occurred');
      }

      const data = await response.json();

      const stk_list = [];

      for (let i = 0; i < data.stk_list.length; i++) {
        let obj = data.stk_list[i];
        const stock = {
          id: i,
          exch: obj.stk_price.exch,
          stk: obj.stk_price.stk,
          stk_date: obj.stk_price.stk_date,
          open_price: obj.stk_price.open_price,
          high_price: obj.stk_price.high_price,
          low_price: obj.stk_price.low_price,
          close_price: obj.stk_price.close_price,
          volume: obj.stk_price.volume,
          stk_name: obj.stk_price.stk_name
        }

        stk_list.push(stock);
      }
      setStocks(stk_list);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  let content = <p>No stocks found.</p>;

  if (stocks.length > 0) {
    content = <StockList stocks={stocks} />
  }

  if (error) {
    content = <p style={{ 'color': 'red' }}>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading stock data...</p>
  }

  return (
    <React.Fragment>
      <section>
        <form onSubmit={fetchStkHandler}>
          <label htmlFor='stk_name'>Stock Name:</label>
          <input type='text' id='stk_name' ref={stkRef} required />
          <button>Search</button>
        </form>
      </section>
      <section>
        <form>
          <label htmlFor='period1'>Start Date:</label>
          <input type='date' id='period1' ref={period1Ref} />
          <label htmlFor='period2'>End Date:</label>
          <input type='date' id='period2' ref={period2Ref} />
        </form>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
