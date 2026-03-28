import React from 'react';
import { Trash2 } from 'lucide-react';

const CustomerDirectors = ({ directors = [] }) => {
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
    </div>
  );
};

export default CustomerDirectors;
