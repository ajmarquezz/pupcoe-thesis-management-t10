
function getByEmail (client, email, callback) {
  const userListQuery = `
    SELECT *
    FROM users
    WHERE email = '${email}'
    `;
  client.query(userListQuery, (req, data) => {
    if (data.rowCount) {
      callback(data.rows[0]);
    } else {
      callback();
    }
  });
};

var User = {
  getByEmail: (client, email, callback) => {
    getByEmail(client, email, callback);
  },

  getById: (client, userId, callback) => {
    const userListQuery = `
      SELECT *
      FROM users
      WHERE id = '${userId}'
    `;
    client.query(userListQuery, (req, data) => {
      if (data.rowCount) {
        callback(data.rows[0]);
      } else {
        callback();
      }
    });
  },


  list: (client, filter, callback) => {
    const userListQuery = `
      SELECT *
      FROM users 
      WHERE user_type = '${filter}'
      ORDER BY id
    `;
    client.query(userListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },



  noClassList: (client, filter, callback) => {
    const query = `
      SELECT *
      FROM users
      WHERE user_type = 'student' AND id NOT IN (SELECT DISTINCT student_id FROM "classStudents")
    `;
    client.query(query, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },


  create: (client, userData, callback) => {
    getByEmail(client, userData.email, function (user) {
      if (user) {
        callback(user);
      } else {
        var users = [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone,
        userData.password,
        userData.user_type,
        userData.is_admin ? true : false,
        userData.student_number || ''
        ];

        const createQuery = `
            INSERT INTO users(first_name, last_name, email, phone, password, user_type, is_admin, student_number)
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8
            )
            RETURNING *
          `;
        client.query(createQuery, users)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));
      }
    });
  }

};

module.exports = User;

//////////////////////////////////////////////////////////////////////////////////////////////
/* eslint-disable new-cap */



// var Customer = {




  // create: (client, customerData, callback) => {
  //   getByEmail(client, customerData.email, function (customer) {
  //     if (customer) {
  //       callback(customer);
  //     } else {
  //       var customers = [customerData.email, customerData.first_name, customerData.last_name, customerData.password];
  //       const createQuery = `
  //       INSERT INTO customers (email, first_name, last_name, password)
  //       VALUES ($1, $2, $3, $4)
  //       `;
  //       client.query(createQuery, customers)
  //         .then(res => callback(null, 'success'))
  //         .catch(e => callback(null, 'error'));
  //     }
  //   });
  // },

  // var customers = [customerData.email, customerData.firstname, customerData.lastname, customerData.street, customerData.municipality, customerData.province, customerData.zipcode];
  // const createQuery = `
  //   INSERT INTO customers (email, first_name, last_name, street, municipality, province, zipcode)
  //   VALUES ($1, $2, $3, $4, $5, $6, $7)
  //   ON CONFLICT $1
  //   DO UPDATE SET
  //   first_name = $2,
  //   last_name = $3,
  //   street = $4,
  //   municipality = $5,
  //   province = $6,
  //   zipcode = $7
  //   SELECT
  //   customers.id
  //   FROM customers
  //   WHERE email = ${customerData.email}
  // `;

  // client.query(createQuery, customers)
  //   .then(res => new callback('success'))
  //   .catch(e => new callback('error'));

//   getCustomer: (client, customerId, callback) => {
//     const getQuery = `
//       SELECT *
//       FROM customers
//       WHERE id = '${customerId.customerId}'
//     `;
//     client.query(getQuery, (req, result) => {
//       callback(result.rows);
//     });
//   },

//   updateProfile: (client, customerId, customerData, callback) => {
//     const query = `
//       UPDATE
//         customers
//       SET
//         email = '${customerData.email}',
//         first_name = '${customerData.first_name}',
//         last_name = '${customerData.last_name}',
//         street = '${customerData.street}',
//         municipality = '${customerData.municipality}',
//         province = '${customerData.province}',
//         zipcode = '${customerData.zipcode}',
//         password = '${customerData.password}'
//       WHERE id = '${customerId.customerId}'
//     `;
//     client.query(query, (req, result) => {
//       callback(result);
//     });
//   },

//   updatePass: (client, customerId, customerData, callback) => {
//     const query = `
//       UPDATE
//         customers
//       SET
//         password = '${customerData.password}'
//       WHERE email = '${customerId.customerId}'
//     `;
//     client.query(query, (req, result) => {
//       callback(result);
//     });
//   },

  // list: (client, limit, offset, filter, callback) => {
  //   const customerListQuery = `
  //     SELECT *
  //     FROM customers 
  //     ORDER BY id
  //     LIMIT '${limit.limit}' OFFSET '${offset.offset}'
  //   `;

//     client.query(customerListQuery, (req, data) => {
//       console.log(data.rows);
//       callback(data.rows);
//     });
//     console.log(customerListQuery);
//   }
// };

// module.exports = Customer;
