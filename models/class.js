/* eslint-disable new-cap */
var Class = {

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

module.exports = Class;
