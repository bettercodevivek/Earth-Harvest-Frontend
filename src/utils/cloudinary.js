/**
 * Cloudinary URL Optimization Utility
 * Adds automatic format and quality optimization to Cloudinary URLs
 */

/**
 * Optimize Cloudinary image URL
 * @param {string} url - Original Cloudinary URL
 * @param {string|number} width - Width parameter (w_800, w_400, w_auto, or number)
 * @param {boolean} lazy - Whether to add lazy loading (default: false for hero, true for others)
 * @returns {string} Optimized Cloudinary URL
 */
export const optimizeCloudinaryImage = (url, width = 'w_auto', lazy = true) => {
  if (!url || typeof url !== 'string') return url;
  
  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Check if already optimized
  if (url.includes('/f_auto,q_auto')) return url;
  
  // Parse the URL to preserve versioning
  // Format: https://res.cloudinary.com/cloud/image/upload/v123/filename.jpg
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;
  
  const baseUrl = urlParts[0] + '/upload/';
  const pathPart = urlParts[1];
  
  // Extract version if present (v1234567890)
  const versionMatch = pathPart.match(/^(v\d+)\//);
  let version = '';
  let filename = pathPart;
  
  if (versionMatch) {
    version = versionMatch[1] + '/';
    filename = pathPart.replace(/^v\d+\//, '');
  }
  
  // Build optimized URL
  // Format: /upload/f_auto,q_auto,w_800/v123/filename.jpg
  // Or: /upload/f_auto,q_auto,w_800/filename.jpg (if no version)
  const transformations = `f_auto,q_auto,${width}`;
  const optimizedUrl = version 
    ? `${baseUrl}${transformations}/${version}${filename}`
    : `${baseUrl}${transformations}/${filename}`;
  
  return optimizedUrl;
};

/**
 * Optimize Cloudinary video URL
 * @param {string} url - Original Cloudinary video URL
 * @returns {string} Optimized Cloudinary video URL
 */
export const optimizeCloudinaryVideo = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Check if already optimized
  if (url.includes('/f_auto,q_auto,vc_auto')) return url;
  
  // Parse the URL to preserve versioning
  // Format: https://res.cloudinary.com/cloud/video/upload/v123/filename.mp4
  const urlParts = url.split('/video/upload/');
  if (urlParts.length !== 2) return url;
  
  const baseUrl = urlParts[0] + '/video/upload/';
  const pathPart = urlParts[1];
  
  // Extract version if present (v1234567890)
  const versionMatch = pathPart.match(/^(v\d+)\//);
  let version = '';
  let filename = pathPart;
  
  if (versionMatch) {
    version = versionMatch[1] + '/';
    filename = pathPart.replace(/^v\d+\//, '');
  }
  
  // Build optimized URL
  // Format: /video/upload/f_auto,q_auto,vc_auto/v123/filename.mp4
  // Or: /video/upload/f_auto,q_auto,vc_auto/filename.mp4 (if no version)
  const transformations = 'f_auto,q_auto,vc_auto';
  const optimizedUrl = version 
    ? `${baseUrl}${transformations}/${version}${filename}`
    : `${baseUrl}${transformations}/${filename}`;
  
  return optimizedUrl;
};

