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
  FaTag,
  FaStar,
  FaDollarSign,
  FaBox,
  FaUpload,
  FaTimes,
  FaCheck,
  FaFilter,
  FaInfoCircle,
  FaRupeeSign,
} from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const ElectricProducts = () => {
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
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");

  const categories = [
    "Home Appliances",
    "Kitchen Appliances",
    "Electronics",
    "Lighting",
    "Power Tools",
    "Smart Home",
    "Wires & Cables",
    "Other",
  ];

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/electric/products`
      );

      // Handle the API response structure
      const productsData = response.data.data || response.data;
      setProducts(productsData);
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
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
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
        toast.error(
          "Invalid file type! Please upload JPEG, PNG, or GIF images"
        );
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

        if (formData.image) {
          data.append("image", formData.image);
        }

        let response;
        if (editingProduct) {
          // Update product
          response = await axios.put(
            `${
              import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
            }/electric/products/${editingProduct._id}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else {
          // Create new product
          response = await axios.post(
            `${
              import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
            }/electric/products`,
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
            `${
              import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
            }/electric/products/${id}`
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
                : "text-gray-300"
            } text-sm`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">
          {rating?.toFixed(1) || "0.0"}
        </span>
      </div>
    );
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      "Home Appliances": "bg-blue-100 text-blue-800",
      "Kitchen Appliances": "bg-green-100 text-green-800",
      Electronics: "bg-purple-100 text-purple-800",
      Lighting: "bg-yellow-100 text-yellow-800",
      "Power Tools": "bg-red-100 text-red-800",
      "Smart Home": "bg-indigo-100 text-indigo-800",
      "Wires & Cables": "bg-gray-100 text-gray-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Format price
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 p-4 md:p-6 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Electric Products
            </h1>
            <p className={` ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
              Manage your electric products inventory
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-200"
          >
            <FaPlus className="mr-2" />
            Add New Product
          </button>
        </div>

        {/* Search and Filter */}
        <div
          className={`${
            darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
          }"rounded-xl shadow p-4 mb-6"`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`${
                darkMode
                  ? "bg-gray-900 text-gray-100"
                  : "bg-gray-50 text-gray-800"
              } rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300}`}
            >
              {/* Product Image */}
              <div
                className={`h-48 ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }  relative`}
              >
                {product.image || product.imageUrl ? (
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <FaImage class="text-gray-400 text-4xl" />
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage
                      className={`${
                        darkMode ? "text-white" : "text-gray-400"
                      }  text-4xl `}
                    />
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
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`font-bold text-lg ${
                      darkMode ? "text-white" : "text-gray-800"
                    }  truncate`}
                  >
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p
                  className={`${
                    darkMode ? "text-white" : "text-gray-600"
                  } text-sm mb-4 line-clamp-2 }`}
                >
                  {product.description || "No description available"}
                </p>

                <div className="space-y-3">
                  {/* Seller */}
                  <div className="flex items-center text-gray-700">
                    <FaUser
                      className={`${
                        darkMode ? "text-white" : "text-gray-600"
                      } mr-2 }`}
                    />
                    <span
                      className={`${
                        darkMode ? "text-white" : "text-gray-600"
                      } text-sm }`}
                    >
                      {product.sellerName}
                    </span>
                  </div>

                  {/* Rating */}
                  <div>{renderStars(product.rating)}</div>

                  {/* Price and Stock */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center">
                      <FaRupeeSign className="text-green-600 mr-1" />
                      <span
                        className={`font-bold text-lg ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Rs.{formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaBox
                        className={`mr-2 ${
                          product.stockQuantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          product.stockQuantity > 0
                            ? "text-green-700"
                            : "text-red-700"
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
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FaInfoCircle className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== "all"
              ? "Try changing your search or filter criteria"
              : "Start by adding your first electric product"}
          </p>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center mx-auto"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Seller Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Name *
                  </label>
                  <input
                    type="text"
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter seller name"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs) *
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-700 font-medium">
                      {formData.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <FaUpload className="text-3xl text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-1">
                          Click to upload product image
                        </p>
                        <p className="text-gray-500 text-sm">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </p>
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border"
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
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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

export default ElectricProducts;
