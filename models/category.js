/* eslint-disable new-cap */
var Category = {

  mostOrdered: (client, filter, callback) => {
    const orders = `
    SELECT DISTINCT 
    products_category.name,
    SUM (orders.quantity)
    FROM
    orders
    INNER JOIN products
    ON products.id = orders.product_id
    INNER JOIN products_category
    ON products_category.id = products.category_id
    GROUP BY
    products_category.name
    ORDER BY SUM DESC limit 3
    `;

    client.query(orders, (req, data) => {
      callback(data.rows);
      console.log(data.rows);
    });
  },

  getById: (client, categoryId, callback) => {
    const listQuery = `
    SELECT id, name
    FROM products_category 
    WHERE id = '${categoryId}'
    `;

    client.query(listQuery, (req, data) => {
      var categoryData = {
        id: data.rows[0].id,
        name: data.rows[0].name
      };
      callback(categoryData);
      console.log(categoryData);
    });
  },

  list: (client, filter, callback) => {
    const categListQuery = `SELECT * FROM products_category ORDER BY name`;
    client.query(categListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  create: (client, categoryData, callback) => {
    var category = [categoryData.category_name];
    const categoryInsertQuery = `
    INSERT INTO products_category (name)
    VALUES ($1)
    `;
    client.query(categoryInsertQuery, category)
      .then(res => new callback('SUCCESS'))
      .catch(e => new callback('ERROR'));
  },

  update: (client, categoryId, categoryData, callback) => {
    var category = [categoryData.category_name];
    const updateQuery = `
    UPDATE products_category
    SET name = $1
    WHERE id = '${categoryId.categoryId}'
    `;

    client.query(updateQuery, category)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));

    console.log(updateQuery);
  }
};

module.exports = Category;
