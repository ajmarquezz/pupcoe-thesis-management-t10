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
    const listQuery = `
    SELECT 
    class.batch AS batch,
    class.section AS section,
    faculty.first_name AS faculty_first_name,
    faculty.last_name AS faculty_last_name
    FROM class
    INNER JOIN faculty ON class.adviser_id=faculty.id
    `;
    client.query(listQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  create: (client, classData, callback) => {
    var classes = [
    classData.batch,
    classData.section,
    classData.adviser
    ];
    const insertQuery = `
    INSERT INTO class (
    batch,
    section,
    adviser_id
    )
    VALUES ($1, $2, $3)
    `;
    client.query(insertQuery, classes)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));
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
