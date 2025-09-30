import React from "react";

function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      {/* The changes are on the line below */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
        {/* The text color is also changed for readability */}
        <p className="text-lg text-white mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;