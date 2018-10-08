/* eslint-disable new-cap */

function getByEmail (client, email, callback) {
  const customerListQuery = `
    SELECT *
    FROM customers
    WHERE email = '${email}'
    `;
  client.query(customerListQuery, (req, data) => {
    if (data.rowCount) {
      callback(data.rows[0]);
    } else {
      callback();
    }
  });
};

var Customer = {
  getByEmail1: (client, email, resetPasswordToken, resetPasswordExpires, callback) => {
    const customerListQuery = `
      SELECT *
      FROM customers
      WHERE email = '${email.email}'
      `;
    client.query(customerListQuery, (req, data) => {
      if (data.rowCount) {
        callback(data.rows[0]);
      } else {
        callback();
      }
    });
  },

  mostOrders: (client, filter, callback) => {
    const order = `
    SELECT
    customer_id, 
    customers.first_name, 
    customers.last_name,
    COUNT (customer_id)
    FROM
    orders
    INNER JOIN customers 
    ON customers.id = orders.customer_id
    GROUP BY
    customer_id,
    customers.first_name,
    customers.last_name
    ORDER BY COUNT DESC limit 10
    `;

    client.query(order, (req, data) => {
      callback(data.rows);
      console.log(data.rows);
    });
  },

  highestPay: (client, filter, callback) => {
    const pay = `
    SELECT DISTINCT 
    customers.first_name, 
    customers.last_name,
    SUM (products.price * orders.quantity)
    FROM
    orders
    INNER JOIN products 
    ON products.id = orders.product_id
    INNER JOIN customers 
    ON customers.id = orders.customer_id
    GROUP BY
    customers.first_name,customers.last_name
    ORDER BY SUM 
    DESC limit 10
    `;

    client.query(pay, (req, data) => {
      callback(data.rows);
      console.log(data.rows);
    });
  },

  getByEmail: (client, email, callback) => {
    getByEmail(client, email, callback);
  },

  getById: (client, customerId, callback) => {
    const customerListQuery = `
      SELECT *
      FROM customers
      WHERE id = '${customerId}'
    `;
    client.query(customerListQuery, (req, data) => {
      if (data.rowCount) {
        callback(data.rows[0]);
      } else {
        callback();
      }
    });
  },

  create: (client, customerData, callback) => {
    getByEmail(client, customerData.email, function (customer) {
      if (customer) {
        callback(customer);
      } else {
        var customers = [customerData.email, customerData.first_name, customerData.last_name, customerData.password];
        const createQuery = `
        INSERT INTO customers (email, first_name, last_name, password)
        VALUES ($1, $2, $3, $4)
        `;
        client.query(createQuery, customers)
          .then(res => callback(null, 'success'))
          .catch(e => callback(null, 'error'));
      }
    });
  },

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

  getCustomer: (client, customerId, callback) => {
    const getQuery = `
      SELECT *
      FROM customers
      WHERE id = '${customerId.customerId}'
    `;
    client.query(getQuery, (req, result) => {
      callback(result.rows);
    });
  },

  updateProfile: (client, customerId, customerData, callback) => {
    const query = `
      UPDATE
        customers
      SET
        email = '${customerData.email}',
        first_name = '${customerData.first_name}',
        last_name = '${customerData.last_name}',
        street = '${customerData.street}',
        municipality = '${customerData.municipality}',
        province = '${customerData.province}',
        zipcode = '${customerData.zipcode}',
        password = '${customerData.password}'
      WHERE id = '${customerId.customerId}'
    `;
    client.query(query, (req, result) => {
      callback(result);
    });
  },

  updatePass: (client, customerId, customerData, callback) => {
    const query = `
      UPDATE
        customers
      SET
        password = '${customerData.password}'
      WHERE email = '${customerId.customerId}'
    `;
    client.query(query, (req, result) => {
      callback(result);
    });
  },

  list: (client, limit, offset, filter, callback) => {
    const customerListQuery = `
      SELECT *
      FROM customers 
      ORDER BY id
      LIMIT '${limit.limit}' OFFSET '${offset.offset}'
    `;

    client.query(customerListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
    console.log(customerListQuery);
  }
};

module.exports = Customer;
