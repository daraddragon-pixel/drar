/**
 * Helper to map raw category strings to URL slugs
 * @param {string} rawCategory 
 * @returns {string} url slug
 */
export const getCategorySlug = (rawCategory) => {
  if (!rawCategory) return '';
  const cleaned = rawCategory.trim();
  if (cleaned === 'កីឡា') return 'sports';
  if (cleaned === 'បច្ចេកវិទ្យា') return 'tech';
  if (cleaned === 'សេដ្ឋកិច្ច') return 'economy';
  if (cleaned === 'សង្គម') return 'social';
  return '';
};
