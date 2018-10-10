/* eslint-disable new-cap */
var Student = {

  getStudent: (client, studentId, callback) => {
    const getQuery = `
      SELECT *
      FROM students
      WHERE id = '${studentId.studentId}'
    `;
    client.query(getQuery, (req, result) => {
      callback(result.rows);
    });
  },

  getById: (client, studentId, callback) => {
    const listQuery = `
      SELECT *
      FROM students
      WHERE id = '${studentId}'
    `;
    client.query(listQuery, (req, data) => {
      if (data.rowCount) {
        callback(data.rows[0]);
      } else {
        callback();
      }
    });
  },

getByEmail: (client, email, callback) => {
  const listQuery = `
    SELECT *
    FROM students
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
