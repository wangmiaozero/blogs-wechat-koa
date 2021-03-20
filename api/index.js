const pool = require('../db/index.js')
let query = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            return reject(err), connection.release()
          } else {
            return resolve(rows), connection.release()
          }
        })
      }
    })
  })
}

module.exports = query
