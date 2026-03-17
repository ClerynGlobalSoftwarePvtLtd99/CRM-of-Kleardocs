import React, { useState } from "react";
import ServicesHeader from "../components/services/ServicesHeader";
import ServicesTable from "../components/services/ServicesTable";
import ServiceFormModal from "../components/services/AddServicesForm";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [services, setServices] = useState([
    {
      id: 1,
      name: "GST Filing",
      template: "Compliance Update",
      hsn: "9983",
      professionalFees: 6000,
      govtFees: 1000,
      status: "Active",
    },
    {
      id: 2,
      name: "ITR Filing",
      template: "Tax Filing",
      hsn: "9984",
      professionalFees: 3000,
      govtFees: 500,
      status: "Inactive",
    },
  ]);

  const [selectedService, setSelectedService] = useState(null);

  const handleAddClick = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (formData) => {
    if (selectedService) {
      const updated = services.map((s) =>
        s.id === selectedService.id ? { ...formData, id: s.id } : s
      );
      setServices(updated);
    } else {
      setServices([
        ...services,
        { ...formData, id: Date.now() },
      ]);
    }
    closeModal();
  };

  return (
    <div className="p-6 bg-bg-primary min-h-screen">
      <ServicesHeader onAddClick={handleAddClick} />

      <ServicesTable
        services={services}
        onEditClick={handleEditClick}
      />

      {isModalOpen && (
        <ServiceFormModal
          key={selectedService?.id || "new"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={selectedService}
        />
      )}
    </div>
  );
};

export default Services;