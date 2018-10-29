/* eslint-disable new-cap */
var Thesis = {

 
  list: (client, filter, callback) => {
    const listQuery = `
    SELECT *
    FROM
    thesis
    `;
    client.query(listQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }

 
};

module.exports = Thesis;




