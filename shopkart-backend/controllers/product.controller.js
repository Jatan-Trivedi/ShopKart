import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (price <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let productsQuery = Product.find(query);

    if (sort === 'price_asc') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery;

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
};