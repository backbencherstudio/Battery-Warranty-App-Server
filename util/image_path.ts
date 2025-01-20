export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  return `${process.env.APP_URL || 'http://localhost:3000'}${imagePath}`;
};

export const baseUrl = process.env.APP_URL || 'http://localhost:3000';

// module.exports = { getImageUrl, baseUrl };


