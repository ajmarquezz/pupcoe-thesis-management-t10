/* eslint-disable new-cap */
var Faculty = {

  getFaculty: (client, facultyId, callback) => {
    const getQuery = `
      SELECT *
      FROM faculty
      WHERE id = '${facultyId.facultyId}'
    `;
    client.query(getQuery, (req, result) => {
      callback(result.rows);
    });
  },

  listByCustomerId: (client, customerId, callback) => {
    const ordersQuery = `
    SELECT
    customers.id AS id,
    customers.first_name AS first,
    customers.last_name AS last,
    customers.email AS email,
    customers.street AS street,
    customers.municipality AS municipality,
    customers.province AS province,
    customers.zipcode AS zipcode,
    products.name AS productsname,
    orders.quantity AS qty,
    orders.order_date AS orderdate
    FROM orders
    INNER JOIN customers
    ON orders.customer_id=customers.id
    INNER JOIN products
    ON orders.product_id=products.id
    WHERE customers.id = ${customerId}
    ORDER BY orderdate DESC
    `;

    client.query(ordersQuery, (req, data) => {
      var orderData = {
        id: data.rows[0].id,
        firstname: data.rows[0].first,
        lastname: data.rows[0].last,
        email: data.rows[0].email,
        street: data.rows[0].street,
        municipality: data.rows[0].municipality,
        province: data.rows[0].province,
        zipcode: data.rows[0].zipcode,
        productsname: data.rows[0].productsname,
        qty: data.rows[0].qty,
        orderdate: data.rows[0].orderdate
      };
      callback(orderData);
      console.log(orderData);
    });
  },
getByEmail: (client, email, callback) => {
  const listQuery = `
    SELECT *
    FROM faculty
    WHERE email = '${email}'
    `;
  client.query(listQuery, (req, data) => {
    if (data.rowCount) {
      callback(data.rows[0]);
    } else {
      callback();
    }
  });
},
  list: (client, filter, callback) => {
    // limit, offset, 
    const listQuery = `
    SELECT *
    FROM faculty
    `;
    // LIMIT '${limit.limit}' OFFSET '${offset.offset}'

    client.query(listQuery, (req, data) => {
      console.log(listQuery);
      console.log(data.rows);
      callback(data.rows);
    });
  },

  create: (client, facultyData, callback) => {
    var faculty = [
      facultyData.first_name,
      facultyData.last_name,
      facultyData.email,
      facultyData.phone,
      facultyData.password,
      facultyData.admin
    ];

    const createQuery = `
    INSERT INTO faculty (first_name, last_name, email, phone, password, date_created, is_admin) 
    VALUES ($1, $2, $3, $4, $5, current_timestamp, $6)
    `;
    client.query(createQuery, faculty)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));
  }
};

module.exports = Faculty;