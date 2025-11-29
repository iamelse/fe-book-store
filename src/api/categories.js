import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

/**
 * Build query params dynamically
 * - removes empty / null / undefined
 * - always injects default page=1 if missing
 */
const buildParams = (params = {}) => {
  const finalParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value !== null && value !== undefined) {
      finalParams[key] = value;
    }
  }

  // Force page always exist (Laravel pagination)
  if (!finalParams.page) finalParams.page = 1;

  return finalParams;
};

/**
 * Fetch all categories
 */
export const getCategories = async (params = {}) => {
  const query = buildParams(params);
  console.log("📤 Fetching categories with params:", query);
  return axios.get(`${BASE_URL}/categories`, { params: query });
};

/**
 * Fetch single category by slug
 */
export const getCategory = async (slug) => {
  if (!slug) throw new Error("Slug is required to fetch category");
  return axios.get(`${BASE_URL}/categories/${slug}`);
};

/**
 * Fetch all items under a category by category slug
 */
export const getCategoryItems = async (slug, params = {}) => {
  if (!slug) throw new Error("Slug is required to fetch category items");
  const query = buildParams(params);
  console.log(`📤 Fetching items for category "${slug}" with params:`, query);
  return axios.get(`${BASE_URL}/categories/${slug}/items`, { params: query });
};