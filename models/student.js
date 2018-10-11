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
    SELECT
    students.id AS id,
    students.first_name AS first_name,
    students.last_name AS last_name,
    students.email AS email,
    students.phone AS phone,
    students.student_number AS student_number,
    class.batch AS batch,
    class.section AS section,
    class.adviser_id AS adviser_id,
    faculty.first_name AS faculty_first_name,
    faculty.last_name AS faculty_last_name
    FROM students
    INNER JOIN class on students.class_id=class.id
    INNER JOIN faculty ON class.adviser_id=faculty.id
    FROM students
    `;
    // LIMIT '${limit.limit}' OFFSET '${offset.offset}'

    client.query(listQuery, (req, data) => {
      var productData = {
        id: data.rows[0].id,
        name: data.rows[0].productsname,
        description: data.rows[0].productsdesc,
        tagline: data.rows[0].tagline,
        price: data.rows[0].productsprice,
        warranty: data.rows[0].warranty,
        img: data.rows[0].productspic,
        brandname: data.rows[0].productsbrand,
        branddesc: data.rows[0].branddesc,
        category: data.rows[0].categoryname,
        title: 'Details'
      };
      callback(productData);
      console.log(productData);
    });
      console.log(data.rows);
      callback(data.rows);f
    });
  },

  create: (client, studentData, callback) => {
    var student = [
      studentData.first_name,
      studentData.last_name,
      studentData.student_number,
      studentData.class_id,
      studentData.email,
      studentData.phone,
      studentData.password
    ];

    const createQuery = `
    INSERT INTO students (
      first_name,
      last_name,
      student_number,
      class_id,
      email,
      phone,
      password,
      date_created
    )
    VALUES ($1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    current_timestamp)
    `;
    console.log(createQuery);
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
