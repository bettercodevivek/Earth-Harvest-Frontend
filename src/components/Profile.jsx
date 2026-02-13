import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Lock, Package, CreditCard, RotateCcw, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from './Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    fetchProfile();
    fetchCartCount();
    
    // Check URL params for tab
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'orders') {
      setActiveTab('orders');
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const response = await apiFetch('/auth/profile');
      if (response.success && response.data) {
        setProfileData({
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          countryCode: response.data.countryCode || '',
          address: {
            street: response.data.address?.street || '',
            city: response.data.address?.city || '',
            state: response.data.address?.state || '',
            country: response.data.address?.country || '',
            zipCode: response.data.address?.zipCode || ''
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load profile data'
      });
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
      console.error('Failed to fetch cart:', error);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await apiFetch('/order');
      if (response.success && response.data) {
        setOrders(Array.isArray(response.data) ? response.data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load orders'
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Profile updated successfully!'
        });
        setIsEditing(false);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const retryPayment = async (orderId, amount) => {
    setRetryingPayment(orderId);
    try {
      // Create new payment link for the order
      const response = await apiFetch('/payment/create', {
        method: 'POST',
        body: JSON.stringify({
          orderId: orderId,
          amount: amount
        })
      });

      if (response.success && response.paymentUrl) {
        // Redirect to payment page
        window.location.href = response.paymentUrl;
      } else {
        throw new Error('Failed to create payment link');
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to retry payment. Please try again.'
      });
      setRetryingPayment(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'profile'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'orders'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            Orders
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F8F2EC] rounded-2xl p-6 sm:p-8 border border-[#E8DFD0]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#C8945C] text-white rounded-lg hover:bg-[#B8844C] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile(); // Reset to original data
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C8945C] text-white rounded-lg hover:bg-[#B8844C] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
                  />
                ) : (
                  <p className="text-muted-foreground">{profileData.name || 'Not set'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <p className="text-muted-foreground">{profileData.email || 'Not set'}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="+971"
                      value={profileData.countryCode}
                      onChange={(e) => setProfileData({ ...profileData, countryCode: e.target.value })}
                      className="w-20 border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Phone number"
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                      className="flex-1 border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {profileData.countryCode && profileData.phoneNumber
                      ? `${profileData.countryCode} ${profileData.phoneNumber}`
                      : 'Not set'}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, street: e.target.value }
                      })}
                      className="border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, city: e.target.value }
                      })}
                      className="border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={profileData.address.state}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, state: e.target.value }
                      })}
                      className="border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={profileData.address.zipCode}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, zipCode: e.target.value }
                      })}
                      className="border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {profileData.address.street || profileData.address.city
                      ? `${profileData.address.street}, ${profileData.address.city}, ${profileData.address.state} ${profileData.address.zipCode}`
                      : 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F8F2EC] rounded-2xl p-6 sm:p-8 border border-[#E8DFD0]"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#C8945C]" />
              My Orders
            </h2>

            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8945C]"></div>
                <p className="text-muted-foreground mt-4">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No orders yet</p>
                <p className="text-muted-foreground text-sm mb-6">Start shopping to see your orders here!</p>
                <Link
                  to="/product"
                  className="inline-block bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 border-2 border-[#E8DFD0] hover:shadow-lg transition-all relative"
                  >
                    {/* Payment Failed Overlay */}
                    {order.paymentStatus === 'Failed' && (
                      <div className="absolute inset-0 bg-red-50/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 border-2 border-red-200">
                        <div className="text-center p-4">
                          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                          <p className="text-lg font-semibold text-red-900 mb-2">Payment Failed</p>
                          <p className="text-sm text-red-700 mb-4">Your payment could not be processed</p>
                          <button
                            onClick={() => retryPayment(order._id, order.amountPaid)}
                            disabled={retryingPayment === order._id}
                            className="bg-[#C8945C] hover:bg-[#B8844C] text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                          >
                            {retryingPayment === order._id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4" />
                                Retry Payment
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-foreground">
                            Order #{order._id?.toString().slice(-8).toUpperCase() || 'N/A'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped'
                              ? 'bg-green-100 text-green-700'
                              : order.orderStatus === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                          {order.paymentStatus === 'Failed' && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 line-through">
                              Payment Failed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Date not available'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#C8945C]">
                          AED {order.amountPaid || '0.00'}
                        </p>
                        <p className={`text-xs ${
                          order.paymentStatus === 'Failed'
                            ? 'text-red-600 font-semibold'
                            : order.paymentStatus === 'Completed'
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }`}>
                          Payment: {order.paymentStatus || 'Pending'}
                        </p>
                      </div>
                    </div>

                    {order.product && (
                      <div className="border-t border-[#E8DFD0] pt-4">
                        <p className="font-semibold text-foreground mb-2">
                          {order.product.productName || order.product.name || 'Product'}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Size: {order.sizeSelected}g</span>
                          <span>Quantity: {order.quantity}</span>
                        </div>
                      </div>
                    )}

                    {order.address && (
                      <div className="border-t border-[#E8DFD0] pt-4 mt-4">
                        <p className="text-sm font-semibold text-foreground mb-1">Delivery Address</p>
                        <p className="text-sm text-muted-foreground">
                          {order.address.street && <>{order.address.street}<br /></>}
                          {order.address.city}{order.address.zipCode ? `, ${order.address.zipCode}` : ''}<br />
                          {order.address.country || 'United Arab Emirates'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;

