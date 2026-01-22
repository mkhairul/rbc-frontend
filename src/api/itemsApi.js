import axios from 'axios';

const API_BASE_URL = 'https://rbc-backend.ddev.site/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Get all inventory items
 * @returns {Promise<Array>} List of items
 */
export const getItems = async () => {
  const response = await apiClient.get('/items');
  return response.data;
};

/**
 * Get a single item by ID
 * @param {number|string} id - Item ID
 * @returns {Promise<Object>} Item data
 */
export const getItem = async (id) => {
  const response = await apiClient.get(`/items/${id}`);
  return response.data;
};

/**
 * Create a new item
 * @param {Object} data - Item data { name, quantity }
 * @returns {Promise<Object>} Created item
 */
export const createItem = async (data) => {
  const response = await apiClient.post('/items', data);
  return response.data;
};

/**
 * Update an existing item
 * @param {number|string} id - Item ID
 * @param {Object} data - Updated item data { name, quantity }
 * @returns {Promise<Object>} Updated item
 */
export const updateItem = async (id, data) => {
  const response = await apiClient.put(`/items/${id}`, data);
  return response.data;
};

/**
 * Delete an item
 * @param {number|string} id - Item ID
 * @returns {Promise<void>}
 */
export const deleteItem = async (id) => {
  await apiClient.delete(`/items/${id}`);
};

/**
 * Get event history for an item
 * @param {number|string} id - Item ID
 * @returns {Promise<Array>} List of events
 */
export const getItemEvents = async (id) => {
  const response = await apiClient.get(`/items/${id}/events`);
  return response.data;
};

export default {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemEvents,
};
