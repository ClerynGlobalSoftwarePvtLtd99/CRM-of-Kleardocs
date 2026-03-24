import Service from "../models/Service.model.js";

export const createService = async (serviceData) => {
  const newService = await Service.create(serviceData);
  return newService;
};

export const getAllServices = async () => {
  const services = await Service.find().sort({ createdAt: -1 });
  return services;
};

export const getServiceById = async (serviceId) => {
  const service = await Service.findById(serviceId);
  return service;
};

export const updateService = async (serviceId, updateData) => {
  const updatedService = await Service.findByIdAndUpdate(serviceId, updateData, { new: true, runValidators: true });
  return updatedService;
};

export const deleteService = async (serviceId) => {
  await Service.findByIdAndDelete(serviceId);
  return true;
};
