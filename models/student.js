/* eslint-disable new-cap */
var Student = {

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
    // limit, offset, 
    const listQuery = `
    SELECT *
    FROM students
    `;
    // LIMIT '${limit.limit}' OFFSET '${offset.offset}'

    client.query(listQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  create: (client, studentData, callback) => {
    var student = [
      studentData.first_name,
      studentData.last_name,
      studentData.student_number,
      studentData.email,
      studentData.phone,
      studentData.password
    ];

    const createQuery = `
    INSERT INTO students (
      first_name, 
      last_name, 
      student_number, 
      email, 
      phone, 
      password, 
      date_created
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, current_timestamp)
    `;
    client.query(createQuery, student)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));
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

module.exports = Student;
