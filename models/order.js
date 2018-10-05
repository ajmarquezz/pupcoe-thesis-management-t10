/* eslint-disable new-cap */
var Order = {

  totalSales7: (client, filter, callback) => {
    const total = `
    SELECT SUM (orders.quantity * products.price) 
    FROM
    orders
    INNER JOIN products
    ON products.id = orders.product_id
    INNER JOIN customers
    ON customers.id = orders.customer_id 
    WHERE order_date 
    BETWEEN CURRENT_DATE - INTERVAL '7 days'
    AND CURRENT_DATE + INTERVAL '1 days'
    `;

    client.query(total, (req, data) => {
      console.log('7days', data.rows);
      callback(data.rows);
    });
  },

  totalSales30: (client, filter, callback) => {
    const total = `
    SELECT SUM (orders.quantity * products.price) 
    FROM
    orders
    INNER JOIN products
    ON products.id = orders.product_id
    INNER JOIN customers
    ON customers.id = orders.customer_id 
    WHERE order_date 
    BETWEEN CURRENT_DATE - INTERVAL '30 days'
    AND CURRENT_DATE + INTERVAL '1 days'
    `;

    client.query(total, (req, data) => {
      console.log('30 days', data.rows);
      callback(data.rows);
    });
  },

  orderCount: (client, filter, callback) => {
    const count = `
    SELECT COUNT (orders.id)
    FROM
    orders
    WHERE order_date 
    BETWEEN CURRENT_DATE - INTERVAL '1 days'
    AND CURRENT_DATE + INTERVAL '1 days'
    `;

    client.query(count, (req, data) => {
      console.log('1 days', data.rows);
      callback(data.rows);
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

  list: (client, limit, offset, filter, callback) => {
    const orderListQuery = `
    SELECT
    customers.first_name AS first,
    customers.last_name AS last,
    products.name AS productsname,
    orders.quantity AS qty,
    orders.order_date AS orderdate
    FROM orders
    INNER JOIN customers
    ON customers.id=orders.customer_id
    INNER JOIN products
    ON products.id=orders.product_id
    ORDER BY orderdate DESC
    LIMIT '${limit.limit}' OFFSET '${offset.offset}'
    `;

    client.query(orderListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  create: (client, orderData, callback) => {
    var order = [orderData.customer_id, orderData.product_id, orderData.quantity];
    const createQuery = `
    INSERT INTO orders (customer_id, product_id, quantity, order_date) 
    VALUES ($1, $2, $3, current_timestamp)
    `;
    client.query(createQuery, order)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));
  }
};

module.exports = Order;
