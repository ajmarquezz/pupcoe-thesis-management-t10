/* eslint-disable new-cap */
var Product = {

  mostOrdered: (client, filter, callback) => {
    const orders = `
      SELECT
      product_id, 
      products.name,
      COUNT (product_id)
      FROM
      orders
      INNER JOIN products 
      ON products.id = orders.product_id
      GROUP BY
      customer_id, products.name,
      orders.product_id 
      ORDER BY COUNT DESC LIMIT 10
    `;

    client.query(orders, (req, data) => {
      callback(data.rows);
      console.log(data.rows);
    });
  },

  leastOrdered: (client, filter, callback) => {
    const orders = `
      SELECT
      product_id, 
      products.name,
      COUNT (product_id)
      FROM
      orders
      INNER JOIN products 
      ON products.id = orders.product_id
      GROUP BY
      customer_id, products.name,
      orders.product_id 
      ORDER BY COUNT ASC LIMIT 10
    `;

    client.query(orders, (req, data) => {
      callback(data.rows);
      console.log(data.rows);
    });
  },

  getById: (client, productId, callback) => {
    const productQuery = `
    SELECT
    products.id AS productsid,
    products.pic AS productspic,
    products.name AS productsname,
    products.description AS productsdesc,
    products.price AS productsprice,
    products.warranty AS warranty,
    products.tagline AS tagline,
    brands.name AS productsbrand,
    brands.description AS branddesc,
    products_category.name AS categoryname
    FROM products
    INNER JOIN brands ON products.brand_id=brands.id
    INNER JOIN products_category ON products.category_id=products_category.id
    WHERE products.id = ${productId}
    ORDER BY productsid ASC
    `;

    client.query(productQuery, (req, data) => {
      var productData = {
        id: data.rows[0].productsid,
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
  },

  getByIdLogged: (client, productId, callback) => {
    const productQuery = `
    SELECT
    products.id AS productsid,
    products.pic AS productspic,
    products.name AS productsname,
    products.description AS productsdesc,
    products.price AS productsprice,
    products.warranty AS warranty,
    products.tagline AS tagline,
    brands.name AS productsbrand,
    brands.description AS branddesc,
    products_category.name AS categoryname
    FROM products
    INNER JOIN brands ON products.brand_id=brands.id
    INNER JOIN products_category ON products.category_id=products_category.id
    WHERE products.id = ${productId}
    ORDER BY productsid ASC
    `;

    client.query(productQuery, (req, data) => {
      var productData = {
        id: data.rows[0].productsid,
        name: data.rows[0].productsname,
        description: data.rows[0].productsdesc,
        tagline: data.rows[0].tagline,
        price: data.rows[0].productsprice,
        warranty: data.rows[0].warranty,
        img: data.rows[0].productspic,
        brandname: data.rows[0].productsbrand,
        branddesc: data.rows[0].branddesc,
        category: data.rows[0].categoryname,
        layout: 'logged',
        title: 'Details'
      };
      callback(productData);
      console.log(productData);
    });
  },

  list: (client, limit, offset, filter, callback) => {
    const productListQuery = `
    SELECT * 
    FROM products 
    ORDER BY id
    LIMIT '${limit.limit}' OFFSET '${offset.offset}'
    `;
    client.query(productListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
    console.log(productListQuery);
  },

  create: (client, productData, callback) => {
    var products = [productData.product_name, productData.product_price, productData.product_warranty, productData.product_category, productData.product_brand, productData.product_tagline, productData.product_desc, productData.product_image];
    const productCreateQuery = `
    INSERT INTO products (name, price, warranty, category_id, brand_id, tagline, description, pic)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    client.query(productCreateQuery, products)
      .then(res => callback(null, 'success'))
      .catch(e => callback(null, 'error'));
  },

  update: (client, productId, productData, callback) => {
    var products = [
      productData.product_name,
      productData.product_price,
      productData.product_warranty,
      productData.product_category,
      productData.product_brand,
      productData.product_tagline,
      productData.product_desc,
      productData.product_image
    ];
    const updateQuery = `
    UPDATE products
    SET
    name = $1,
    price = $2,
    warranty = $3,
    category_id = $4,
    brand_id = $5,
    tagline = $6,
    description = $7,
    pic = $8'
    WHERE
    id = '${productId.productId}'
    `;

    client.query(updateQuery, products)
      .then(res => new callback('success'))
      .catch(e => new callback('error'));

    console.log(updateQuery);
  }
};

module.exports = Product;
