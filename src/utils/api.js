const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const apiFetch = async (url, options = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Build full URL if relative
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers
    }
  });

  // Handle 204 No Content responses
  if (res.status === 204) {
    return { success: true, data: null };
  }

  // Check if response has content
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    if (!res.ok) {
      throw { message: `Request failed with status ${res.status}` };
    }
    return { success: true, data: null };
  }

  const data = await res.json();
  if (!res.ok) {
    // If unauthorized, clear token
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw data;
  }
  return data;
};
