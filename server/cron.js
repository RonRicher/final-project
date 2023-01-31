const cron = require('node-cron');
const con = require('./connection.js');

const deleteFlight = () =>{ cron.schedule(' 0 0 0 * * *', () => {
    sql = 'delete FROM deal_package WHERE start_date < CURRENT_DATE'
    con.query(sql, (err, result) => {{
        if(err) throw err;
        console.log(result)
    }})
    sql = 'delete FROM flight WHERE flight_date < CURRENT_DATE'
    con.query(sql, (err, result) => {{
        if(err) throw err;
        console.log(result)
    }})
   
  })};

  module.exports = deleteFlight;