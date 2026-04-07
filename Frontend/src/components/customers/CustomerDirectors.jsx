import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { deleteDirector } from '../../redux/slices/customersSlice';

const CustomerDirectors = ({ directors = [], customerId }) => {
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState(null);

  const handleDeleteClick = (directorId) => {
    setDirectorToDelete(directorId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerId || !directorToDelete) {
      toast.error("Invalid deletion request");
      return;
    }

    try {
      await dispatch(deleteDirector({ customerId, directorId: directorToDelete })).unwrap();
      toast.success("Director removed successfully");
      setShowDeleteConfirm(false);
      setDirectorToDelete(null);
    } catch (err) {
      toast.error(err || "Failed to remove director");
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-8 mb-6 text-text-primary">
      <h5 className="text-[1.5rem] font-normal leading-[1.334] m-0"><b className="font-bold">Directors</b></h5>
      
      <div className="flex flex-wrap flex-row gap-6 w-full mt-2">
        {directors.length > 0 ? (
          directors.map((d, i) => (
            <div 
              key={i} 
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
            >
              <div>
                <div className="bg-bg-secondary text-text-primary rounded-[4px] p-4 shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.2),0px_4px_5px_0px_rgba(0,0,0,0.14),0px_1px_10px_0px_rgba(0,0,0,0.12)] transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <h6 className="text-[1.25rem] font-medium leading-[1.6] m-0 tracking-[0.0075em]">
                        {d.name || d.directorName}
                      </h6>
                      <span className="text-[1rem] leading-[1.5] tracking-[0.00938em]">
                        {d.phone || '-'}
                      </span>
                    </div>
                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      <Trash2 
                        size={18} 
                        className="text-[#f44336] cursor-pointer hover:opacity-80 transition-opacity" 
                        fill="currentColor"
                        onClick={() => handleDeleteClick(d._id || d.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-[1rem] italic py-4">
            No directors added.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - Styled like Logout */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-500/20">
              <Trash2 size={32} />
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Remove Director?
            </h2>
            <p className="text-text-secondary mb-8 text-sm leading-relaxed">
              Are you sure you want to remove this director? <br className="hidden sm:block" />
              This action cannot be undone.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-bg-tertiary text-text-primary hover:bg-bg-tertiary rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/25 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDirectors;
