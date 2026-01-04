import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { ToastContainer } from "../components/Toast";

const AuthContext = createContext(undefined);

// Toast system
let toastId = 0;
const toastListeners = new Set();

export const showToast = (toast) => {
  const id = ++toastId;
  const toastWithId = { ...toast, id, duration: toast.duration || 3000 };
  toastListeners.forEach(listener => listener(toastWithId));
  return id;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpName, setOtpName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast management
  useEffect(() => {
    const listener = (toast) => {
      setToasts(prev => [...prev, toast]);
    };
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const sendOTP = async (email, name) => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email, name })
      });
      
      if (response.success) {
        setOtpEmail(email);
        setOtpName(name);
        setShowOtpModal(true);
        setShowLoginModal(false);
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to send OTP' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to send OTP. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response.success && response.token) {
        // Store token and user
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setShowLoginModal(false);
        
        // Show success toast
        showToast({
          type: 'success',
          title: 'Login Successful!',
          message: `Welcome back, ${response.user.name || 'Admin'}!`,
          duration: 3000
        });
        
        // Execute pending action if any
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        return { success: true };
      }
      return { success: false, message: response.message || 'Invalid credentials' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: otpEmail, otp })
      });
      
      if (response.success && response.token) {
        // Store token and user
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setShowOtpModal(false);
        setShowLoginModal(false);
        
        // Show success toast
        showToast({
          type: 'success',
          title: 'Login Successful!',
          message: `Welcome back, ${response.user.name || 'User'}!`,
          duration: 3000
        });
        
        // Execute pending action if any
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        return { success: true };
      }
      return { success: false, message: response.message || 'Invalid OTP' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Invalid OTP. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOtpEmail("");
    setOtpName("");
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out.',
      duration: 2000
    });
  };

  const requireAuth = (action) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLoginModal(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        sendOTP,
        verifyOTP,
        adminLogin,
        logout,
        requireAuth,
        showLoginModal,
        setShowLoginModal,
        showOtpModal,
        setShowOtpModal,
        otpEmail,
        otpName,
        isLoading,
        pendingAction,
        setPendingAction,
        showToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
