/* eslint-disable new-cap */
var Brand = {

  mostOrdered: (client, filter, callback) => {
    const orders = `
    SELECT DISTINCT 
    brands.name,
    SUM (orders.quantity)
    FROM
    orders
    INNER JOIN products
    ON products.id = orders.product_id
    INNER JOIN brands
    ON brands.id = products.brand_id
    GROUP BY
    brands.name
    ORDER BY SUM DESC limit 3
    `;

    client.query(orders, (req, data) => {
      callback(data.rows);
      console.log(data.rows);
    });
  },

  getById: (client, brandId, callback) => {
    const listQuery = `
    SELECT id, name, description
    FROM brands
    WHERE id = '${brandId}'
    `;

    client.query(listQuery, (req, data) => {
      var brandData = {
        id: data.rows[0].id,
        name: data.rows[0].name,
        desc: data.rows[0].description
      };
      callback(brandData);
      console.log(brandData);
    });
  },

  list: (client, filter, callback) => {
    const brandListQuery = `SELECT * FROM brands ORDER BY name`;
    client.query(brandListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  create: (client, brandData, callback) => {
    var brand = [brandData.brand_name, brandData.brand_desc];
    const brandInsertQuery = `
    INSERT INTO brands (name, description)
    VALUES ($1, $2)
    `;
    client.query(brandInsertQuery, brand)
      .then(res => new callback('SUCCESS'))
      .catch(e => new callback('ERROR'));
  },

  update: (client, brandId, brandData, callback) => {
    var brand = [brandData.brand_name, brandData.brand_desc];
    const updateQuery = `
    UPDATE brands
    SET name = $1, description = $2
    WHERE id = '${brandId.brandId}'
    `;

    client.query(updateQuery, brand)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));

    console.log(updateQuery);
  }
};

module.exports = Brand;
