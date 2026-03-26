import axiosInstance from './axiosInstance';

// Get customer by ID
export const getCustomerById = async (id) => {
  const response = await axiosInstance.get(`/customers/${id}`);
  return response.data;
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  const response = await axiosInstance.put(`/customers/${id}`, customerData);
  return response.data;
};

// Add service to customer
export const addServiceToCustomer = async (customerId, serviceData) => {
  const response = await axiosInstance.post(`/customers/${customerId}/services`, serviceData);
  return response.data;
};

// Update customer service
export const updateCustomerService = async (customerId, serviceId, serviceData) => {
  const response = await axiosInstance.put(`/customers/${customerId}/services/${serviceId}`, serviceData);
  return response.data;
};

// End customer service
export const endCustomerService = async (customerId, serviceId) => {
  const response = await axiosInstance.delete(`/customers/${customerId}/services/${serviceId}`);
  return response.data;
};
