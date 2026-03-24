import Service from "../models/Service.model.js";

const templateOptions = [
  "Compliance Update",
  "Annual Compliance Service - Jagjyot Singh",
  "Annual Compliance Service - Ritu Kaur",
  "Annual Compliance Service plus GST plus ESI - Ritu Kaur",
  "Annual Compliance - Onboarding",
  "Startup India Registration",
  "Startup India Promotion",
  "Website",
  "Professional Tax",
  "GST Filling",
  "Service List",
  "Next Quarter Payment",
  "INC 20A Reminder",
  "ROC plus GST plus ESI plus TDS",
  "Package plus payment details",
  "Annual Compliance plus Bookkeeping",
  "Director Resignation"
];

export const populateServiceTemplates = async () => {
  try {
    console.log("Populating service templates...");
    
    // Get all services that don't have a template
    const services = await Service.find({ 
      $or: [
        { template: { $exists: false } },
        { template: "" },
        { template: null }
      ]
    });

    console.log(`Found ${services.length} services without templates`);

    for (const service of services) {
      // Assign a random template from the options
      const randomTemplate = templateOptions[Math.floor(Math.random() * templateOptions.length)];
      
      await Service.findByIdAndUpdate(
        service._id,
        { template: randomTemplate },
        { new: true }
      );
      
      console.log(`Updated service "${service.name}" with template: ${randomTemplate}`);
    }

    console.log("Template population completed successfully!");
    
    // Verify the update
    const updatedServices = await Service.find();
    console.log("Updated services:");
    updatedServices.forEach(service => {
      console.log(`- ${service.name}: ${service.template || 'No template'}`);
    });

    return true;
  } catch (error) {
    console.error("Error populating service templates:", error);
    return false;
  }
};
