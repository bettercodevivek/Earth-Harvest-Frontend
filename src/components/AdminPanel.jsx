import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Plus, Edit2, Trash2, Users, ShoppingBag, CreditCard, 
  BarChart3, Save, X, AlertCircle, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from './Navbar';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [productForm, setProductForm] = useState({
    productName: '',
    brand: 'Earth & Harvest',
    smallDescription: '',
    longDescription: '',
    rating: 0,
    totalReviews: 0,
    soldThisMonth: 0,
    stock: 0,
    images: [''],
    sizes: [{ weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }],
    ingredients: [''],
    features: [{ icon: '', title: '', desc: '' }],
    nutritionFacts: [{ name: '', value: '', bar: 0 }]
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
      showToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Admin privileges required'
      });
      return;
    }

    fetchProducts();
    fetchCartCount();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/admin/products');
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load products'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await apiFetch('/cart');
      if (response.success && response.data) {
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      // Ignore cart errors for admin
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up empty arrays/strings
      const cleanedForm = {
        ...productForm,
        images: productForm.images.filter(img => img.trim() !== ''),
        ingredients: productForm.ingredients.filter(ing => ing.trim() !== ''),
        features: productForm.features.filter(f => f.title.trim() !== ''),
        nutritionFacts: productForm.nutritionFacts.filter(n => n.name.trim() !== ''),
        sizes: productForm.sizes.filter(s => s.weight > 0 && s.price > 0)
      };

      if (editingProduct) {
        // Update product
        const response = await apiFetch(`/admin/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(cleanedForm)
        });
        
        if (response.success) {
          showToast({
            type: 'success',
            title: 'Success',
            message: 'Product updated successfully!'
          });
          setShowProductForm(false);
          setEditingProduct(null);
          fetchProducts();
        }
      } else {
        // Create product
        const response = await apiFetch('/admin/products', {
          method: 'POST',
          body: JSON.stringify(cleanedForm)
        });
        
        if (response.success) {
          showToast({
            type: 'success',
            title: 'Success',
            message: 'Product created successfully!'
          });
          setShowProductForm(false);
          resetForm();
          fetchProducts();
        }
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save product'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      productName: '',
      brand: 'Earth & Harvest',
      smallDescription: '',
      longDescription: '',
      rating: 0,
      totalReviews: 0,
      soldThisMonth: 0,
      stock: 0,
      images: [''],
      sizes: [{ weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }],
      ingredients: [''],
      features: [{ icon: '', title: '', desc: '' }],
      nutritionFacts: [{ name: '', value: '', bar: 0 }]
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      productName: product.productName || '',
      brand: product.brand || 'Earth & Harvest',
      smallDescription: product.smallDescription || '',
      longDescription: product.longDescription || '',
      rating: product.rating || 0,
      totalReviews: product.totalReviews || 0,
      soldThisMonth: product.soldThisMonth || 0,
      stock: product.stock || 0,
      images: product.images && product.images.length > 0 ? product.images : [''],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }],
      ingredients: product.ingredients && product.ingredients.length > 0 ? product.ingredients : [''],
      features: product.features && product.features.length > 0 ? product.features : [{ icon: '', title: '', desc: '' }],
      nutritionFacts: product.nutritionFacts && product.nutritionFacts.length > 0 ? product.nutritionFacts : [{ name: '', value: '', bar: 0 }]
    });
    setShowProductForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await apiFetch(`/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Product deleted successfully!'
        });
        fetchProducts();
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete product'
      });
    }
  };

  // Show loading or redirect - don't render if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          {activeTab === 'products' && (
            <button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#C8945C] text-white rounded-lg hover:bg-[#B8844C] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'products'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'orders'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'users'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {loading && !showProductForm ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : showProductForm ? (
              <ProductForm
                productForm={productForm}
                setProductForm={setProductForm}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                loading={loading}
                editing={!!editingProduct}
              />
            ) : (
              <div className="grid gap-4">
                {products.length === 0 ? (
                  <div className="bg-[#F8F2EC] rounded-2xl p-12 text-center border border-[#E8DFD0]">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No products found</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowProductForm(true);
                      }}
                      className="px-4 py-2 bg-[#C8945C] text-white rounded-lg hover:bg-[#B8844C] transition-colors"
                    >
                      Create First Product
                    </button>
                  </div>
                ) : (
                  products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#F8F2EC] rounded-2xl p-6 border border-[#E8DFD0]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{product.productName}</h3>
                          <p className="text-muted-foreground mb-4">{product.smallDescription}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-foreground">Stock: <strong>{product.stock}</strong></span>
                            <span className="text-foreground">Sizes: <strong>{product.sizes?.length || 0}</strong></span>
                            <span className="text-foreground">Rating: <strong>{product.rating || 0}</strong></span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-[#F8F2EC] rounded-2xl p-6 border border-[#E8DFD0]">
            <p className="text-muted-foreground">Orders management coming soon...</p>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-[#F8F2EC] rounded-2xl p-6 border border-[#E8DFD0]">
            <p className="text-muted-foreground">Users management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ productForm, setProductForm, onSubmit, onCancel, loading, editing }) => {
  const addSize = () => {
    setProductForm({
      ...productForm,
      sizes: [...productForm.sizes, { weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }]
    });
  };

  const removeSize = (index) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter((_, i) => i !== index)
    });
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...productForm.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setProductForm({ ...productForm, sizes: newSizes });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="bg-[#F8F2EC] rounded-2xl p-6 sm:p-8 border border-[#E8DFD0] space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {editing ? 'Edit Product' : 'Create New Product'}
      </h2>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Product Name *</label>
          <input
            type="text"
            required
            value={productForm.productName}
            onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Brand</label>
          <input
            type="text"
            value={productForm.brand}
            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Short Description *</label>
        <textarea
          required
          value={productForm.smallDescription}
          onChange={(e) => setProductForm({ ...productForm, smallDescription: e.target.value })}
          rows={2}
          className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Long Description</label>
        <textarea
          value={productForm.longDescription}
          onChange={(e) => setProductForm({ ...productForm, longDescription: e.target.value })}
          rows={4}
          className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
        />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={productForm.rating}
            onChange={(e) => setProductForm({ ...productForm, rating: parseFloat(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Total Reviews</label>
          <input
            type="number"
            min="0"
            value={productForm.totalReviews}
            onChange={(e) => setProductForm({ ...productForm, totalReviews: parseInt(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Sold This Month</label>
          <input
            type="number"
            min="0"
            value={productForm.soldThisMonth}
            onChange={(e) => setProductForm({ ...productForm, soldThisMonth: parseInt(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Stock *</label>
          <input
            type="number"
            required
            min="0"
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Images (URLs)</label>
        {productForm.images.map((img, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Image URL"
              value={img}
              onChange={(e) => {
                const newImages = [...productForm.images];
                newImages[index] = e.target.value;
                setProductForm({ ...productForm, images: newImages });
              }}
              className="flex-1 border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
            />
            {productForm.images.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setProductForm({
                    ...productForm,
                    images: productForm.images.filter((_, i) => i !== index)
                  });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          + Add Image
        </button>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Sizes *</label>
        {productForm.sizes.map((size, index) => (
          <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-4 bg-white rounded-xl border border-[#E8DFD0]">
            <input
              type="number"
              placeholder="Weight (lbs)"
              required
              value={size.weight || ''}
              onChange={(e) => updateSize(index, 'weight', parseFloat(e.target.value) || 0)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            <input
              type="number"
              placeholder="Price"
              required
              step="0.01"
              value={size.price || ''}
              onChange={(e) => updateSize(index, 'price', parseFloat(e.target.value) || 0)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            <input
              type="number"
              placeholder="Old Price"
              step="0.01"
              value={size.oldPrice || ''}
              onChange={(e) => updateSize(index, 'oldPrice', parseFloat(e.target.value) || 0)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Servings"
              value={size.servings || ''}
              onChange={(e) => updateSize(index, 'servings', e.target.value)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            {productForm.sizes.length > 1 && (
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          + Add Size
        </button>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Ingredients</label>
        {productForm.ingredients.map((ing, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ing}
              onChange={(e) => {
                const newIngredients = [...productForm.ingredients];
                newIngredients[index] = e.target.value;
                setProductForm({ ...productForm, ingredients: newIngredients });
              }}
              className="flex-1 border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
            />
            {productForm.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setProductForm({
                    ...productForm,
                    ingredients: productForm.ingredients.filter((_, i) => i !== index)
                  });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setProductForm({ ...productForm, ingredients: [...productForm.ingredients, ''] })}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          + Add Ingredient
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-[#C8945C] text-white rounded-xl hover:bg-[#B8844C] transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {editing ? 'Update Product' : 'Create Product'}
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default AdminPanel;

