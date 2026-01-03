import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaImage,
  FaUser,
  FaStar,
  FaRupeeSign,
  FaBox,
  FaUpload,
  FaTimes,
  FaCheck,
  FaFilter,
  FaInfoCircle,
  FaTools,
  FaPaintBrush,
  FaHome,
  FaIndustry,
} from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const HardwarePainterProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { darkMode } = useOutletContext();

  // Product form state
  const [formData, setFormData] = useState({
    productName: "",
    sellerName: "",
    rating: 0,
    price: "",
    category: "",
    description: "",
    stockQuantity: "",
    brand: "",
    material: "",
    color: "",
    weight: "",
    dimensions: "",
    warranty: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");

  const categories = [
    "Power Tools",
    "Hand Tools",
    "Paint & Coatings",
    "Brushes & Rollers",
    "Plumbing Supplies",
    "Electrical Supplies",
    "Safety Equipment",
    "Fasteners & Hardware",
    "Wood & Lumber",
    "Metal & Steel",
    "Adhesives & Sealants",
    "Cleaning Supplies",
    "Other",
  ];

  const materialOptions = [
    "Steel",
    "Wood",
    "Plastic",
    "Aluminum",
    "Copper",
    "Brass",
    "Glass",
    "Ceramic",
    "Rubber",
    "Composite",
    "Other",
  ];

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/hardware/products`
      );

      // Handle the API response structure
      const productsData = response.data.data || response.data;
      setProducts(productsData);
      console.log("Fetched products:", productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.material?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseFloat(value) : value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large! Maximum size is 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type! Please upload JPEG, PNG, or GIF images");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      productName: "",
      sellerName: "",
      rating: 0,
      price: "",
      category: "",
      description: "",
      stockQuantity: "",
      brand: "",
      material: "",
      color: "",
      weight: "",
      dimensions: "",
      warranty: "",
      image: null,
    });
    setImagePreview("");
    setEditingProduct(null);
  };

  // Open modal for add/edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productName: product.productName || "",
        sellerName: product.sellerName || "",
        rating: product.rating || 0,
        price: product.price || "",
        category: product.category || "",
        description: product.description || "",
        stockQuantity: product.stockQuantity || "",
        brand: product.brand || "",
        material: product.material || "",
        color: product.color || "",
        weight: product.weight || "",
        dimensions: product.dimensions || "",
        warranty: product.warranty || "",
        image: null,
      });
      setImagePreview(product.image || product.imageUrl || "");
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.productName ||
      !formData.sellerName ||
      !formData.price ||
      !formData.category ||
      !formData.stockQuantity
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitPromise = new Promise(async (resolve, reject) => {
      try {
        const data = new FormData();
        data.append("productName", formData.productName);
        data.append("sellerName", formData.sellerName);
        data.append("rating", formData.rating);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("stockQuantity", formData.stockQuantity);
        data.append("brand", formData.brand);
        data.append("material", formData.material);
        data.append("color", formData.color);
        data.append("weight", formData.weight);
        data.append("dimensions", formData.dimensions);
        data.append("warranty", formData.warranty);

        if (formData.image) {
          data.append("image", formData.image);
        }

        let response;
        if (editingProduct) {
          // Update product
          response = await axios.put(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/hardware/products/${editingProduct._id}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else {
          // Create new product
          response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/hardware/products`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        }

        fetchProducts();
        closeModal();
        resolve(response);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong";
        reject(new Error(errorMessage));
      }
    });

    toast.promise(submitPromise, {
      loading: editingProduct ? "Updating product..." : "Adding product...",
      success: editingProduct
        ? "Product updated successfully!"
        : "Product added successfully!",
      error: (err) => err.message,
    });
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const deletePromise = new Promise(async (resolve, reject) => {
        try {
          await axios.delete(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/hardware/products/${id}`
          );
          fetchProducts();
          resolve();
        } catch (error) {
          reject(new Error("Failed to delete product"));
        }
      });

      toast.promise(deletePromise, {
        loading: "Deleting product...",
        success: "Product deleted successfully!",
        error: "Failed to delete product",
      });
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${
              index < Math.floor(rating)
                ? "text-yellow-500"
                : index < rating
                ? "text-yellow-300"
                : darkMode ? "text-gray-600" : "text-gray-300"
            } text-sm`}
          />
        ))}
        <span className={`ml-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {rating?.toFixed(1) || "0.0"}
        </span>
      </div>
    );
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    if (category.includes("Tool")) {
      return <FaTools className="text-blue-500" />;
    } else if (category.includes("Paint") || category.includes("Brush")) {
      return <FaPaintBrush className="text-pink-500" />;
    } else if (category.includes("Wood") || category.includes("Lumber")) {
      return <FaHome className="text-amber-600" />;
    } else if (category.includes("Metal") || category.includes("Steel")) {
      return <FaIndustry className="text-gray-500" />;
    }
    return <FaTools className="text-gray-500" />;
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      "Power Tools": darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800",
      "Hand Tools": darkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-100 text-indigo-800",
      "Paint & Coatings": darkMode ? "bg-pink-900/30 text-pink-300" : "bg-pink-100 text-pink-800",
      "Brushes & Rollers": darkMode ? "bg-rose-900/30 text-rose-300" : "bg-rose-100 text-rose-800",
      "Plumbing Supplies": darkMode ? "bg-teal-900/30 text-teal-300" : "bg-teal-100 text-teal-800",
      "Electrical Supplies": darkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-800",
      "Safety Equipment": darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800",
      "Fasteners & Hardware": darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800",
      "Wood & Lumber": darkMode ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-800",
      "Metal & Steel": darkMode ? "bg-gray-900/30 text-gray-300" : "bg-gray-100 text-gray-800",
      "Adhesives & Sealants": darkMode ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-800",
      "Cleaning Supplies": darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800",
      "Other": darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800",
    };
    return colors[category] || (darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800");
  };

  // Format price
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} p-4 md:p-6`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Hardware & Painter Products
            </h1>
            <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Manage hardware tools, paints, and construction materials inventory
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className={`mt-4 md:mt-0 font-semibold py-2 px-4 rounded-lg flex items-center transition duration-200 ${
              darkMode 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <FaPlus className="mr-2" />
            Add New Product
          </button>
        </div>

        {/* Search and Filter */}
        <div className={`rounded-xl shadow p-4 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Search products, sellers, or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  darkMode 
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" 
                    : "border border-gray-300 placeholder-gray-500"
                }`}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <FaFilter className={`mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    darkMode 
                      ? "bg-gray-700 text-white border-gray-600" 
                      : "border-gray-300"
                  }`}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? "border-blue-500" : "border-blue-600"}`}></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Product Image */}
              <div className={`h-48 ${darkMode ? "bg-gray-700" : "bg-gray-100"} relative`}>
                {product.image || product.imageUrl ? (
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="text-4xl">
                            ${getCategoryIcon(product.category).props.className.includes('text-blue-500') ? 
                              '<FaTools class="text-blue-500" />' : 
                              getCategoryIcon(product.category).props.className.includes('text-pink-500') ?
                              '<FaPaintBrush class="text-pink-500" />' :
                              getCategoryIcon(product.category).props.className.includes('text-amber-600') ?
                              '<FaHome class="text-amber-600" />' :
                              '<FaTools class="text-gray-500" />'}
                          </div>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-4xl">
                      {getCategoryIcon(product.category)}
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                      product.category
                    )}`}
                  >
                    {product.category}
                  </span>
                </div>
                {product.brand && (
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${darkMode ? "bg-gray-900/80 text-gray-200" : "bg-white/90 text-gray-800"}`}>
                      {product.brand}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-lg truncate ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className={`p-1 ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className={`p-1 ${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"}`}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {product.description || "No description available"}
                </p>

                <div className="space-y-3">
                  {/* Seller */}
                  <div className={`flex items-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <FaUser className={`mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <span className="text-sm">{product.sellerName}</span>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-wrap gap-2">
                    {product.material && (
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                        {product.material}
                      </span>
                    )}
                    {product.color && (
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                        {product.color}
                      </span>
                    )}
                    {product.warranty && (
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"}`}>
                        Warranty: {product.warranty}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div>{renderStars(product.rating)}</div>

                  {/* Price and Stock */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <FaRupeeSign className={`mr-1 ${product.stockQuantity > 0 ? "text-green-500" : "text-red-500"}`} />
                      <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Rs.{formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaBox
                        className={`mr-2 ${
                          product.stockQuantity > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          product.stockQuantity > 0
                            ? darkMode ? "text-green-400" : "text-green-700"
                            : darkMode ? "text-red-400" : "text-red-700"
                        }`}
                      >
                        {product.stockQuantity} in stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <FaInfoCircle className={`text-5xl mx-auto mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            No products found
          </h3>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {searchTerm || selectedCategory !== "all"
              ? "Try changing your search or filter criteria"
              : "Start by adding your first hardware or painter product"}
          </p>
          <button
            onClick={() => openModal()}
            className={`font-semibold py-2 px-6 rounded-lg flex items-center mx-auto ${
              darkMode 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className={`fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50 ${darkMode ? "dark" : ""}`}>
          <div className={`rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
          }`}>
            <div className={`sticky top-0 border-b px-6 py-4 flex justify-between items-center ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}>
              <h2 className="text-2xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className={`text-xl ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="e.g., Hammer, Paint Brush, Plumbing Pipe"
                  />
                </div>

                {/* Seller Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Seller Name *
                  </label>
                  <input
                    type="text"
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="Enter seller name"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Price (Rs) *
                  </label>
                  <div className="relative">
                    <FaRupeeSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="e.g., Bosch, Asian Paints, Kajaria"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Material
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select material</option>
                    {materialOptions.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="e.g., Red, Blue, Silver"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="e.g., 2.5 kg"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="e.g., 10x5x2 cm"
                  />
                </div>

                {/* Warranty */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="e.g., 1 year, 6 months"
                  />
                </div>

                {/* Rating */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                        className="focus:outline-none"
                      >
                        <FaStar
                          className={`text-2xl ${
                            star <= formData.rating
                              ? "text-yellow-500"
                              : darkMode ? "text-gray-600" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className={`ml-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {formData.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="Describe the product in detail..."
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Product Image
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors ${
                    darkMode 
                      ? "border-gray-600 hover:border-blue-500" 
                      : "border-gray-300 hover:border-blue-500"
                  }`}>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <FaUpload className={`text-3xl mb-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                        <p className={`mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Click to upload product image
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <p className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Preview:
                      </p>
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData({ ...formData, image: null });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className={`flex justify-end gap-3 mt-8 pt-6 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-6 py-2 border rounded-lg transition ${
                    darkMode 
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                  <FaCheck className="mr-2" />
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwarePainterProducts;