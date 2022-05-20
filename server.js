const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const path = require('path');

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/exch/:exch', (req, res) => {
    const query = "SELECT * FROM exch WHERE exch=?";

    db.get(query, [req.params['exch'].toUpperCase()], (err, row) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        res.send({'exch': row});
    });
});

app.get('/exch/', (req, res) => {
    const query = "SELECT * FROM exch";

    db.all(query, [], (err, rows) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        res.send({'ExchList': rows});
    });
});

app.get('/StkPrice/:stk', (req, res) => {
    const query = `SELECT stk_price.*, stk.stk_name 
    FROM stk_price
    INNER JOIN stk ON stk_price.stk = stk.stk 
    WHERE stk_price.stk=? AND stk_date=(SELECT MAX(stk_date) FROM stk_price)`;

    db.get(query, [req.params['stk'].toUpperCase()], (err, row) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        res.send({'stk_list': [{'stk_price': row}]});
    });
});

app.get('/StkPrice/:stk/date', (req, res) => {
    const query = `SELECT stk_price.*, stk.stk_name 
    FROM stk_price
    INNER JOIN stk ON stk_price.stk = stk.stk 
    WHERE (stk_price.stk=? AND stk_date >= '${req.query['period1']}' and stk_date <= '${req.query['period2']}')
    ORDER BY stk_date DESC`;

    const stk_list = [];
    db.all(query, [req.params['stk'].toUpperCase()], (err, rows) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        rows.forEach((row) => {
            stk_list.push({'stk_price': row});
        });
        res.send({'stk_list': stk_list});
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});
  
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('stk.db', (err) => {
    if (err) {
        console.log(err.message);
        throw err;
    } else {
        console.log('Connected to SQLite database');
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});