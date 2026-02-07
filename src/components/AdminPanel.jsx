import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Plus, Edit2, Trash2, Users, ShoppingBag, CreditCard, 
  BarChart3, Save, X, AlertCircle, CheckCircle, TrendingUp, 
  DollarSign, Eye, EyeOff, Ban, Unlock, Filter, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from './Navbar';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderFilters, setOrderFilters] = useState({ status: '', paymentStatus: '' });
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);
  const [statusUpdateConfirm, setStatusUpdateConfirm] = useState(null);
  
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
    
    if (user?.role !== 'admin') {
      navigate('/');
      showToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Admin privileges required'
      });
      return;
    }

    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
    fetchCartCount();
  }, [isAuthenticated, user, navigate, activeTab]);

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

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/admin/dashboard');
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard stats'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (filters = null) => {
    try {
      setOrdersLoading(true);
      const params = new URLSearchParams();
      const activeFilters = filters || orderFilters;
      if (activeFilters.status) params.append('status', activeFilters.status);
      if (activeFilters.paymentStatus) params.append('paymentStatus', activeFilters.paymentStatus);
      
      const response = await apiFetch(`/admin/orders?${params.toString()}`);
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load orders'
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      
      const response = await apiFetch(`/admin/users?${params.toString()}`);
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users'
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus, currentStatus) => {
    setStatusUpdateConfirm({ orderId, newStatus, currentStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!statusUpdateConfirm) return;
    
    try {
      const response = await apiFetch(`/admin/orders/${statusUpdateConfirm.orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: statusUpdateConfirm.newStatus })
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Order status updated successfully!'
        });
        fetchOrders();
        setStatusUpdateConfirm(null);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update order status'
      });
      setStatusUpdateConfirm(null);
    }
  };

  const handleToggleProductStatus = async (productId, currentStatus) => {
    try {
      const response = await apiFetch(`/admin/products/${productId}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled: !currentStatus })
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Product ${!currentStatus ? 'enabled' : 'disabled'} successfully!`
        });
        fetchProducts();
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update product status'
      });
    }
  };

  const handleToggleUserBlock = async (userId, isBlocked) => {
    try {
      const response = await apiFetch(`/admin/users/${userId}/block`, {
        method: 'PATCH',
        body: JSON.stringify({ isBlocked: !isBlocked })
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `User ${!isBlocked ? 'blocked' : 'unblocked'} successfully!`
        });
        fetchUsers();
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, isBlocked: !isBlocked });
        }
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update user status'
      });
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      setLoadingUserOrders(true);
      const response = await apiFetch(`/admin/users/${userId}`);
      if (response.success) {
        setSelectedUser(response.data.user);
        setUserOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load user details'
      });
    } finally {
      setLoadingUserOrders(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedForm = {
        ...productForm,
        images: productForm.images.filter(img => img.trim() !== ''),
        ingredients: productForm.ingredients.filter(ing => ing.trim() !== ''),
        features: productForm.features.filter(f => f.title.trim() !== ''),
        nutritionFacts: productForm.nutritionFacts.filter(n => n.name.trim() !== ''),
        sizes: productForm.sizes.filter(s => s.weight > 0 && s.price > 0)
      };

      if (editingProduct) {
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-[#C8945C] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar cartCount={cartCount} />
      
      {/* ADMIN HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage products, orders, and users</p>
            </div>
            {activeTab === 'products' && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8945C] text-white text-sm font-medium rounded-md hover:bg-[#B8844C] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* NAVIGATION TABS */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-x-auto">
          <nav className="flex min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'text-[#C8945C] border-[#C8945C] bg-[#C8945C]/5'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'text-[#C8945C] border-[#C8945C] bg-[#C8945C]/5'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'text-[#C8945C] border-[#C8945C] bg-[#C8945C]/5'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'text-[#C8945C] border-[#C8945C] bg-[#C8945C]/5'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>
          </nav>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-3 border-gray-300 border-t-[#C8945C] rounded-full animate-spin"></div>
              </div>
            ) : dashboardStats ? (
              <div className="space-y-6">
                {/* STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.stats?.totalUsers || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Users</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.stats?.totalProducts || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Products</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.stats?.totalOrders || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Orders</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">AED {dashboardStats.stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
                  </div>
                </div>

                {/* PENDING ORDERS ALERT */}
                {dashboardStats.stats?.pendingOrders > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Pending Orders</p>
                      <p className="text-sm text-amber-700 mt-0.5">{dashboardStats.stats.pendingOrders} orders require attention</p>
                    </div>
                  </div>
                )}

                {/* RECENT ORDERS TABLE */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
                  </div>
                  {dashboardStats.recentOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dashboardStats.recentOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                #{order._id?.toString().slice(-8).toUpperCase()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {order.user?.name || order.user?.email || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                                {order.product?.productName || 'Product'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${
                                  order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped'
                                    ? 'bg-green-100 text-green-800'
                                    : order.orderStatus === 'Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.orderStatus || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <p className="text-sm text-gray-500">No recent orders</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-sm text-gray-500">Failed to load dashboard data</p>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            {loading && !showProductForm ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-3 border-gray-300 border-t-[#C8945C] rounded-full animate-spin"></div>
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
              <div>
                {products.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">No products found</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowProductForm(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8945C] text-white text-sm font-medium rounded-md hover:bg-[#B8844C] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Product
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Sizes</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{product.smallDescription}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 hidden md:table-cell">
                                {product.stock}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 hidden lg:table-cell">
                                {product.sizes?.length || 0}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 hidden lg:table-cell">
                                {product.rating || 0}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${
                                  product.enabled === false
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {product.enabled === false ? 'Disabled' : 'Active'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleToggleProductStatus(product._id, product.enabled !== false)}
                                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                    title={product.enabled === false ? 'Enable' : 'Disable'}
                                  >
                                    {product.enabled === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleEdit(product)}
                                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product._id)}
                                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* FILTERS */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Order Status</label>
                  <select
                    value={orderFilters.status}
                    onChange={(e) => {
                      const newFilters = { ...orderFilters, status: e.target.value };
                      setOrderFilters(newFilters);
                      fetchOrders(newFilters);
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Payment Status</label>
                  <select
                    value={orderFilters.paymentStatus}
                    onChange={(e) => {
                      const newFilters = { ...orderFilters, paymentStatus: e.target.value };
                      setOrderFilters(newFilters);
                      fetchOrders(newFilters);
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
                  >
                    <option value="">All Payments</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      const clearedFilters = { status: '', paymentStatus: '' };
                      setOrderFilters(clearedFilters);
                      fetchOrders(clearedFilters);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* ORDERS TABLE */}
            {ordersLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-3 border-gray-300 border-t-[#C8945C] rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                #{order._id?.toString().slice(-8).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 hidden md:table-cell">
                            {order.user?.name || order.user?.email || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                            {order.product?.productName || 'Product'}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            AED {order.amountPaid || '0.00'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${
                                order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped'
                                  ? 'bg-green-100 text-green-800'
                                  : order.orderStatus === 'Pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {order.orderStatus || 'Pending'}
                              </span>
                              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${
                                order.paymentStatus === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.paymentStatus === 'Failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.paymentStatus || 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.orderStatus || 'Pending'}
                              onChange={(e) => {
                                if (e.target.value !== order.orderStatus) {
                                  handleOrderStatusUpdate(order._id, e.target.value, order.orderStatus);
                                }
                              }}
                              className="w-full border border-gray-300 px-2 py-1.5 rounded text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* SEARCH */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setTimeout(fetchUsers, 300);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
                />
              </div>
            </div>

            {/* USERS TABLE */}
            {usersLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-3 border-gray-300 border-t-[#C8945C] rounded-full animate-spin"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500 mt-0.5 md:hidden">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 hidden md:table-cell">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role || 'user'}
                              </span>
                              {user.isBlocked && (
                                <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                                  Blocked
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewUserDetails(user._id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => handleToggleUserBlock(user._id, user.isBlocked)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                                  user.isBlocked
                                    ? 'text-green-700 bg-green-50 border border-green-200 hover:bg-green-100'
                                    : 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100'
                                }`}
                              >
                                {user.isBlocked ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Unblock</span>
                                  </>
                                ) : (
                                  <>
                                    <Ban className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Block</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USER DETAILS MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setUserOrders([]);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">User Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                      <p className="text-sm text-gray-900">{selectedUser.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Role</p>
                      <p className="text-sm text-gray-900">{selectedUser.role || 'user'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                      <p className={`text-sm font-medium ${selectedUser.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Order History</h3>
                  {loadingUserOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-3 border-gray-300 border-t-[#C8945C] rounded-full animate-spin"></div>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No orders found</p>
                  ) : (
                    <div className="space-y-3">
                      {userOrders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Order #{order._id?.toString().slice(-8).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}
                              </p>
                            </div>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${
                              order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped'
                                ? 'bg-green-100 text-green-800'
                                : order.orderStatus === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus || 'Pending'}
                            </span>
                          </div>
                          {order.product && (
                            <p className="text-sm text-gray-700 mb-1">
                              {order.product.productName} - {order.sizeSelected}g × {order.quantity}
                            </p>
                          )}
                          <p className="text-sm font-medium text-gray-900">AED {order.amountPaid || '0.00'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATUS UPDATE CONFIRMATION MODAL */}
        {statusUpdateConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirm Status Update</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to update order status from <strong>{statusUpdateConfirm.currentStatus}</strong> to <strong>{statusUpdateConfirm.newStatus}</strong>?
                {statusUpdateConfirm.newStatus !== 'Pending' && (
                  <span className="block mt-2">An email notification will be sent to the customer.</span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStatusUpdateConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  className="flex-1 px-4 py-2 bg-[#C8945C] text-white text-sm font-medium rounded-md hover:bg-[#B8844C] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PRODUCT FORM COMPONENT
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
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {editing ? 'Edit Product' : 'Create New Product'}
        </h2>
      </div>

      {/* BASIC INFO */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Name *</label>
          <input
            type="text"
            required
            value={productForm.productName}
            onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Brand</label>
          <input
            type="text"
            value={productForm.brand}
            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Short Description *</label>
        <textarea
          required
          value={productForm.smallDescription}
          onChange={(e) => setProductForm({ ...productForm, smallDescription: e.target.value })}
          rows={2}
          className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Long Description</label>
        <textarea
          value={productForm.longDescription}
          onChange={(e) => setProductForm({ ...productForm, longDescription: e.target.value })}
          rows={4}
          className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={productForm.rating}
            onChange={(e) => setProductForm({ ...productForm, rating: parseFloat(e.target.value) || 0 })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Reviews</label>
          <input
            type="number"
            min="0"
            value={productForm.totalReviews}
            onChange={(e) => setProductForm({ ...productForm, totalReviews: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Sold/Month</label>
          <input
            type="number"
            min="0"
            value={productForm.soldThisMonth}
            onChange={(e) => setProductForm({ ...productForm, soldThisMonth: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Stock *</label>
          <input
            type="number"
            required
            min="0"
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
          />
        </div>
      </div>

      {/* IMAGES */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Images (URLs)</label>
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
              className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
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
                className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
          className="mt-1 text-sm text-[#C8945C] hover:text-[#B8844C] font-medium"
        >
          + Add Image
        </button>
      </div>

      {/* SIZES */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Sizes *</label>
        {productForm.sizes.map((size, index) => (
          <div key={index} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <input
              type="number"
              placeholder="Weight"
              required
              value={size.weight || ''}
              onChange={(e) => updateSize(index, 'weight', parseFloat(e.target.value) || 0)}
              className="border border-gray-300 px-2 py-1.5 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C]"
            />
            <input
              type="number"
              placeholder="Price"
              required
              step="0.01"
              value={size.price || ''}
              onChange={(e) => updateSize(index, 'price', parseFloat(e.target.value) || 0)}
              className="border border-gray-300 px-2 py-1.5 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C]"
            />
            <input
              type="number"
              placeholder="Old Price"
              step="0.01"
              value={size.oldPrice || ''}
              onChange={(e) => updateSize(index, 'oldPrice', parseFloat(e.target.value) || 0)}
              className="border border-gray-300 px-2 py-1.5 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C]"
            />
            <input
              type="text"
              placeholder="Servings"
              value={size.servings || ''}
              onChange={(e) => updateSize(index, 'servings', e.target.value)}
              className="border border-gray-300 px-2 py-1.5 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C]"
            />
            {productForm.sizes.length > 1 && (
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="mt-1 text-sm text-[#C8945C] hover:text-[#B8844C] font-medium"
        >
          + Add Size
        </button>
      </div>

      {/* INGREDIENTS */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Ingredients</label>
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
              className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8945C] focus:border-[#C8945C]"
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
                className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setProductForm({ ...productForm, ingredients: [...productForm.ingredients, ''] })}
          className="mt-1 text-sm text-[#C8945C] hover:text-[#B8844C] font-medium"
        >
          + Add Ingredient
        </button>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-[#C8945C] text-white text-sm font-medium rounded-md hover:bg-[#B8844C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {editing ? 'Update Product' : 'Create Product'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminPanel;