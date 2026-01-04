import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Lock, Package, CreditCard } from 'lucide-react';
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
  }, [isAuthenticated, navigate]);

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
            <h2 className="text-2xl font-bold text-foreground mb-6">My Orders</h2>
            <p className="text-muted-foreground">No orders yet. Start shopping to see your orders here!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;

