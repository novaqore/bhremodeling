import { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';

const KickbackPendingModal = ({ requests, isOpen, onClose, formatCurrency }) => {
  const modalRef = useRef();
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pendingKickbacks = requests ? Object.values(requests).filter(request => 
    Number(request.kickbackFee) > 0 && !request.kickbackPaidDate
  ) : [];

  const handleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pendingKickbacks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingKickbacks.map(request => request.id));
    }
  };

  const handleProcess = () => {
    if (selectedIds.length > 0) {
      const selectedRequests = pendingKickbacks.filter(request => selectedIds.includes(request.id));
      console.log('Processing selected requests:', selectedRequests);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="text-purple-500" size={20} />
            <h2 className="text-lg font-medium">Pending Kickbacks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {pendingKickbacks.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No pending kickbacks found
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    checked={selectedIds.length === pendingKickbacks.length}
                    onChange={handleSelectAll}
                  />
                  <span>Select All</span>
                </label>
              </div>
              <div className="divide-y divide-gray-200">
                {pendingKickbacks.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-gray-50">
                    <div className="flex gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          checked={selectedIds.includes(request.id)}
                          onChange={() => handleSelect(request.id)}
                        />
                      </label>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Check #{request.checkNumber}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-purple-600">
                              {formatCurrency(request.kickbackFee)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Amount: {formatCurrency(request.requestAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {pendingKickbacks.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleProcess}
              disabled={selectedIds.length === 0}
              className={`w-full py-2 px-4 rounded-md font-medium
                ${selectedIds.length > 0 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Process Selected ({selectedIds.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const KickbackPending = ({ requests, formatCurrency }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingCount = requests ? Object.values(requests).filter(
    request => Number(request.kickbackFee) > 0 && !request.kickbackPaidDate
  ).length : 0;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1
          ${pendingCount > 0 ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
      >
        <ArrowLeftRight size={16} />
        <span>Pending Kickback</span>
        {pendingCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-purple-200 text-purple-800 text-xs">
            {pendingCount}
          </span>
        )}
      </button>

      <KickbackPendingModal
        requests={requests}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formatCurrency={formatCurrency}
      />
    </>
  );
};

export default KickbackPending;