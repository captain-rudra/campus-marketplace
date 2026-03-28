const Product = require("../models/Product");

// ১. Create Product (Max 6 images, linked to user)
exports.createProduct = async (req, res) => {
  try {
    const { title, price, negotiable } = req.body;
    
    // ছবিগুলো req.files থেকে নেওয়া হচ্ছে (Multer-এর মাধ্যমে)
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    if (imageUrls.length === 0) {
      return res.status(400).json({ error: "At least 1 image is required." });
    }

    const newProduct = new Product({
      title, price, negotiable, images: imageUrls,
      seller: req.user.id // যে লগইন করা আছে, তার ID
    });

    await newProduct.save();
    res.status(201).json({ message: "Product uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error uploading product" });
  }
};

// ২. Get All Products (সবার জন্য, ইউজারের আপডেটেড ডিটেইলস সহ)
exports.getProducts = async (req, res) => {
  try {
    // populate-এর মাধ্যমে seller-এর লেটেস্ট নাম, ফোন, রুম নম্বর চলে আসবে
    const products = await Product.find().populate("seller", "name phone roomNo hostelNo rollNo");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

// ৩. Get My Products (লগইন করা ইউজার শুধু নিজের প্রোডাক্ট দেখবে)
exports.getMyProducts = async (req, res) => {
  try {
    const myProducts = await Product.find({ seller: req.user.id });
    res.json(myProducts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching your products" });
  }
};

// ৪. Update Product (Status, Price, Negotiable)
exports.updateProduct = async (req, res) => {
  try {
    const { productId, status, price, negotiable } = req.body;
    
    // ইউজার শুধু নিজের প্রোডাক্ট আপডেট করতে পারবে
    const product = await Product.findOne({ _id: productId, seller: req.user.id });
    if (!product) return res.status(403).json({ error: "Not authorized or Product not found" });

    if (status) product.status = status;
    if (price) product.price = price;
    if (negotiable) product.negotiable = negotiable;

    // যদি নতুন ছবি দেয়, তবে আগেরগুলো রিপ্লেস হবে
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => file.filename);
    }

    await product.save();
    res.json({ message: "Product updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// ৫. Delete Product (ইউজার নিজের প্রোডাক্ট ডিলিট করবে)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user.id });
    if (!product) return res.status(403).json({ error: "Not authorized to delete this product" });
    
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
