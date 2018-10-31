/* eslint-disable new-cap */
var Thesis = {

  listAll: (client, filter, callback) => {
    const listQuery = `
    SELECT *
    FROM
    thesis
    `;
    client.query(listQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },
  listFilter: (client, filter, callback) => {
    const listQuery = `
    SELECT *
    FROM
    thesis
    WHERE group_id = '${filter}'
    `;
    client.query(listQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },
  list: (client, filter, callback) => {
    const listQuery = `
    SELECT *
    FROM
    thesis
    WHERE
    stage = 'pending'
    `;
    client.query(listQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  listCommittee: (client, filter, callback) => {
    const listQuery = `
    SELECT *
    FROM
    thesis
    WHERE
    stage = 'for committee'
    `;
    client.query(listQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  checkIfCommittee: (client, facultyId, callback) => {
    const query = `
    SELECT EXISTS (SELECT id FROM "facultyCommittee" WHERE faculty_id = '${facultyId}')
    `;
  client.query(query, (req, data) => {
    if (data.rowCount) {
      callback(data.rows[0]);
    } else {
      callback();
    }
  });

  },

  updateStatus: (client, thesisData, callback) => {
    var thesis = [
    thesisData.stage,
    thesisData.thesis_id
    ]

    const query = `
    UPDATE 
    thesis 
    SET 
    stage = $1,
    date_updated = current_date
    WHERE id = $2
    `;
        client.query(query, thesis)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));
        }
        // ,

  // updateStatusForDefense: (client, thesisData, callback) => {
  //   var thesis = [
  //   thesisData.stage,
  //   thesisData.thesis_id
  //   ]

  //   const query = `
  //   UPDATE 
  //   thesis 
  //   SET 
  //   stage = $1,
  //   date_updated = current_date
  //   WHERE id = $2
  //   `;
  //       client.query(query, thesis)
  //     .then(res => new callback('success'))
  //     .catch(e => new callback('error'));
  // },

  // updateStatusForDefenseUse: (client, thesisData, callback) => {
  //   var thesis = [
  //   thesisData.stage,
  //   thesisData.thesis_id
  //   ]

  //   const query = `
  //   UPDATE 
  //   thesis 
  //   SET 
  //   stage = $1,
  //   date_updated = current_date
  //   WHERE id = $2
  //   `;
  //       client.query(query, thesis)
  //     .then(res => new callback('success'))
  //     .catch(e => new callback('error'));
  // }
};

module.exports = Thesis;




