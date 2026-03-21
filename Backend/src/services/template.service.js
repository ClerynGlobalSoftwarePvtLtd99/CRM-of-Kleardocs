import EmailTemplate from "../models/EmailTemplate.model.js";

export const createTemplate = async (templateData) => {
  const newTemplate = await EmailTemplate.create(templateData);
  return newTemplate;
};

export const getAllTemplates = async (filters = {}) => {
  const query = {};
  if (filters.type) query.type = filters.type;

  const templates = await EmailTemplate.find(query).sort({ createdAt: -1 });
  return templates;
};

export const getTemplateById = async (templateId) => {
  const template = await EmailTemplate.findById(templateId);
  return template;
};

export const updateTemplate = async (templateId, updateData) => {
  const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
    templateId, 
    updateData, 
    { new: true, runValidators: true }
  );
  return updatedTemplate;
};

export const deleteTemplate = async (templateId) => {
  await EmailTemplate.findByIdAndDelete(templateId);
  return true;
};