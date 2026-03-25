import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServicesHeader from "../components/services/ServicesHeader";
import ServicesTable from "../components/services/ServicesTable";
import ServiceFormModal from "../components/services/AddServicesForm";
import { fetchServices, createService, updateService, clearSuccess } from "../redux/slices/servicesSlice";
import toast from "react-hot-toast";
import ContentLoader from "../components/common/ContentLoader";

const Services = () => {
  const dispatch = useDispatch();
  const { services, loading, error, success, successMessage } = useSelector((state) => state.services);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Fetch services on component mount
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Clear success messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleAddClick = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (formData) => {
    try {
      if (selectedService) {
        const result = await dispatch(updateService({ id: selectedService._id, serviceData: formData }));
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Service updated successfully!');
          // Refetch services to get fresh data
          dispatch(fetchServices());
        }
      } else {
        const result = await dispatch(createService(formData));
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Service created successfully!');
        }
      }
      closeModal();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-bg-primary min-h-screen">
      {loading && (
        <div className="py-8">
          <ContentLoader message="Fetching services..." />
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}
      
      <ServicesHeader onAddClick={handleAddClick} servicesCount={services.length} />
      
      <ServicesTable
        services={services}
        onEditClick={handleEditClick}
        loading={loading}
      />
      
      {isModalOpen && (
        <ServiceFormModal
          key={selectedService?._id || "new"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={selectedService}
        />
      )}
    </div>
  );
};

export default Services;