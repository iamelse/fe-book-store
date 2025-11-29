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
 * Fetch items with flexible parameters
 * @param {Object} params - query params like { search, category, limit, sort, page }
 */
export const getItems = async (params = {}) => {
  const query = buildParams(params);

  // console.log("📤 Sending params to API:", query);

  return axios.get(`${BASE_URL}/items`, { params: query });
};

/**
 * Fetch single item by slug
 */
export const getItem = (slug) => {
  return axios.get(`${BASE_URL}/items/${slug}`);
};