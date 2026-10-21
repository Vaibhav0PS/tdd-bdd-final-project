const { Product, Category } = require('../../src/models/product');
const { ProductFactory } = require('../factories');

describe('Product Model', () => {

  // Clean the database before every test
  beforeEach(async () => {
    await Product.destroy({
      where: {},
      truncate: true,
      cascade: true,
      force: true,
      restartIdentity: true
    });
  });

  // -------------------- Product Creation --------------------

  describe('Product Creation', () => {

    test('should create a product and assert that it exists', () => {
      const productData = {
        name: 'Fedora',
        description: 'A red hat',
        price: 12.50,
        available: true,
        category: Category.CLOTHS
      };

      const product = new Product(productData);

      expect(product).toBeDefined();
      expect(product.id).toBeNull();
      expect(product.name).toBe('Fedora');
      expect(product.description).toBe('A red hat');
      expect(product.available).toBe(true);
      expect(product.price).toBe(12.50);
      expect(product.category).toBe(Category.CLOTHS);
    });

    test('should add a product to the database', async () => {
      const products = await Product.findAll();
      expect(products).toEqual([]);

      const productData = ProductFactory.build();
      delete productData.id;

      const product = await Product.create(productData);

      expect(product.id).toBeDefined();

      const allProducts = await Product.findAll();
      expect(allProducts.length).toBe(1);

      const newProduct = allProducts[0];

      expect(newProduct.name).toBe(productData.name);
      expect(newProduct.description).toBe(productData.description);
      expect(parseFloat(newProduct.price)).toBe(
        parseFloat(productData.price)
      );
      expect(newProduct.available).toBe(productData.available);
      expect(newProduct.category).toBe(productData.category);
    });

  });

  // -------------------- Product Reading --------------------

  describe('Product Reading', () => {

    test('should read a product', async () => {
      const product = await ProductFactory.create();

      expect(product.id).toBeDefined();

      const found = await Product.findByPk(product.id);

      expect(found).not.toBeNull();
      expect(found.id).toBe(product.id);
      expect(found.name).toBe(product.name);
      expect(found.description).toBe(product.description);
      expect(parseFloat(found.price)).toBe(
        parseFloat(product.price)
      );
      expect(found.available).toBe(product.available);
      expect(found.category).toBe(product.category);
    });

  });

  // -------------------- Product Updating --------------------

  describe('Product Updating', () => {

    test('should update a product', async () => {
      const product = await ProductFactory.create();

      expect(product.id).toBeDefined();

      const originalId = product.id;

      product.description = 'Updated description';
      await product.save();

      expect(product.id).toBe(originalId);
      expect(product.description).toBe('Updated description');

      const products = await Product.findAll();

      expect(products.length).toBe(1);
      expect(products[0].id).toBe(originalId);
      expect(products[0].description).toBe('Updated description');
    });

  });

  // -------------------- Product Deletion --------------------

  describe('Product Deletion', () => {

    test('should delete a product', async () => {
      const productData = ProductFactory.build();
      delete productData.id;

      const savedProduct = await Product.create(productData);

      expect(savedProduct.id).toBeDefined();

      let products = await Product.findAll();
      expect(products.length).toBe(1);

      await savedProduct.destroy();

      products = await Product.findAll();
      expect(products.length).toBe(0);
    });

  });

  // -------------------- List All Products --------------------

  describe('Product Listing', () => {

    test('should list all products in the database', async () => {
      let products = await Product.findAll();

      expect(products.length).toBe(0);

      // Create five products
      for (let i = 0; i < 5; i++) {
        const productData = ProductFactory.build();
        delete productData.id;

        await Product.create(productData);
      }

      // Verify that all five products exist
      products = await Product.findAll();

      expect(products.length).toBe(5);
    });

  });

  // -------------------- Find Product By Name --------------------

  describe('Find Product By Name', () => {

    test('should find a product by name', async () => {
      const products = await ProductFactory.createList(5);

      const name = products[0].name;

      const count = products.filter(
        product => product.name === name
      ).length;

      const found = await Product.findByName(name);

      expect(found.length).toBe(count);

      for (const product of found) {
        expect(product.name).toBe(name);
      }
    });

  });

  // -------------------- Find Products By Availability --------------------

  describe('Find Products By Availability', () => {

    test('should find products by availability', async () => {
      const products = await ProductFactory.createList(10);

      const available = products[0].available;

      const count = products.filter(
        product => product.available === available
      ).length;

      const found = await Product.findByAvailability(available);

      expect(found.length).toBe(count);

      for (const product of found) {
        expect(product.available).toBe(available);
      }
    });

  });

  // -------------------- Find Products By Category --------------------

  describe('Find Products By Category', () => {

    test('should find products by category', async () => {
      const products = await ProductFactory.createList(10);

      const category = products[0].category;

      const count = products.filter(
        product => product.category === category
      ).length;

      const found = await Product.findByCategory(category);

      expect(found.length).toBe(count);

      for (const product of found) {
        expect(product.category).toBe(category);
      }
    });

  });

});