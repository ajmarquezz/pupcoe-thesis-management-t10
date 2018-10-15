/* eslint-disable new-cap */
var Class = {

  getById: (client, classId, callback) => {
    const listQuery = `
    SELECT
    classes.id AS id,
    classes.batch AS batch,
    classes.section AS section,
    users.id AS adviser_id,
    users.first_name AS adviser_first_name,
    users.last_name AS adviser_last_name
    FROM classes
    INNER JOIN users ON classes.adviser=users.id
    WHERE classes.id = '${classId}'
    `;

    client.query(listQuery, (req, data) => {
      var classData = {
        id: data.rows[0].id,
        batch: data.rows[0].batch,
        section: data.rows[0].section,
        first_name: data.rows[0].adviser_first_name,
        last_name: data.rows[0].adviser_last_name
      };
      callback(classData);
      console.log(classData);
    });
  },

  list: (client, filter, callback) => {
    const listQuery = `
    SELECT
    classes.id AS id,
    classes.batch AS batch,
    classes.section AS section,
    users.id AS adviser_id,
    users.first_name AS adviser_first_name,
    users.last_name AS adviser_last_name
    FROM classes
    INNER JOIN users ON classes.adviser=users.id
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
    INSERT INTO classes (
    batch,
    section,
    adviser
    )
    VALUES ($1, $2, $3)
    RETURNING *
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







//sir tria
// const db = require('./../db');

// var Class = {
//   getById: (id) => {
//     const query = `
//       SELECT
//         c.id,
//         c.batch,
//         c.section,
//         u.id as adviser_id,
//         u.first_name as adviser_first_name,
//         u.last_name as adviser_last_name
//       FROM classes c
//       INNER JOIN users u on c.adviser = u.id
//       WHERE c.id = ${id}
//     `;
//     var promise = new Promise((resolve, reject) => {
//       db.query(query, (req, data) => {
//         if (data && data.rowCount) {
//           resolve(data.rows[0]);
//         } else {
//           resolve(null);
//         }
//       });
//     });
//     return promise;
//   },
//   getByStudentId: (studentId) => {
//     const query = `
//       SELECT 
//         cl.batch,
//         cl.section,
//         u.first_name ,
//         u.last_name,
//         u.email,
//         us.first_name as adviser_fname,
//         us.last_name as adviser_lname,
//         us.email as adviser_email
//       FROM "classStudents" c
//       INNER JOIN classes cl on c.class_id = cl.id
//       INNER JOIN users u on c.student_id = u.id
//       INNER JOIN users us on cl.adviser = us.id
//       WHERE c.student_id = ${studentId}
//     `;
//     var promise = new Promise((resolve, reject) => {
//       db.query(query, (req, data) => {
//         console.log('getByStudentId', data.rows);
//         if (data && data.rowCount) {
//           resolve(data.rows[0]);
//         } else {
//           resolve(null);
//         }
//       });
//     });
//     return promise;
//   },
//   getStudentsByClassId: (classId) => {
//     const query = `
//       SELECT *
//       FROM "classStudents" c
//       INNER JOIN users u on c.student_id = u.id
//       WHERE c.class_id = ${classId}
//     `;
//     var promise = new Promise((resolve, reject) => {
//       db.query(query, (req, data) => {
//         if (data && data.rowCount) {
//           resolve(data.rows);
//         } else {
//           resolve([]);
//         }
//       });
//     });
//     return promise;
//   },
  // list: (filter) => {
  //   const query = `
  //     SELECT
  //       c.id,
  //       c.batch,
  //       c.section,
  //       u.id as adviser_id,
  //       u.first_name as adviser_first_name,
  //       u.last_name as adviser_last_name
  //     FROM classes c
  //     INNER JOIN users u on c.adviser = u.id
  //   `;
  //   var promise = new Promise((resolve, reject) => {
  //     db.query(query, (req, data) => {
  //       if (data && data.rowCount) {
  //         resolve(data.rows);
  //       } else {
  //         resolve([]);
  //       }
  //     });
  //   });
  //   return promise;
  // },
//   listByFacultyId: (facultyId) => {
//     const query = `
//       SELECT
//         id,
//         batch,
//         section
//       FROM classes 
//       WHERE adviser=${facultyId}
//     `;
//     var promise = new Promise((resolve, reject) => {
//       console.log('query', query)
//       db.query(query, (req, data) => {
//         console.log('req', req)
//         if (data && data.rowCount) {
//           resolve(data.rows);
//         } else {
//           resolve([]);
//         }
//       });
//     });
//     return promise;
//   },
  // create: (data) => {
  //   // check first if user with given email already exists
  //   const promise = new Promise((resolve, reject) => {
  //     var createQuery = `
  //       INSERT INTO classes(batch, section, adviser)
  //       VALUES (
  //         '${data.batch}',
  //         '${data.section}',
  //         '${data.adviser}'
  //       )
  //       RETURNING *
  //     `;
  //     db.query(createQuery, (req, data) => {
  //       console.log('req', req);
  //       console.log('created', data);
  //       resolve(data.rows[0]);
  //     });
  //   });
  //   return promise;
  // },
//   addStudents: (classId, studentIds) => {
//     console.log('addStudents', classId, studentIds);
//     const promise = new Promise((resolve, reject) => {

//       var values = [];
//       studentIds.forEach((studentId) => {
//         values.push(`('${classId}', '${studentId}')`)
//       })
//       var query = `
//         INSERT INTO "classStudents"(class_id, student_id)
//         VALUES ${values.join(',')}
//         RETURNING *
//       `;
//       console.log('query', query);
//       db.query(query, (req, data) => {
//         console.log('added', req, data);
//         resolve(data.rows);
//       });
//     });
//     return promise;
//   }
// };
// module.exports = Class;




