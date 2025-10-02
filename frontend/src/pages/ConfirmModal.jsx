import React from "react";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  bookingStatus,
  propertyTitle,
  selectedDate,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal box */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {bookingStatus !== "booked" ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Appointment
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              You're about to book a visit for{" "}
              <span className="font-medium text-gray-800">{propertyTitle}</span>{" "}
              on <span className="font-medium text-gray-800">{selectedDate}</span>
              . Please confirm.
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {/* Part 1: The Circle*/}
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  strokeWidth={1.5} 
                />

                {/* Part 2: The Checkmark*/}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12.5l3 3 5-5" 
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">Booked!</h3>
              <p className="text-sm text-gray-600 text-center">
                Your appointment for{" "}
                <span className="font-medium text-gray-800">{propertyTitle}</span>{" "}
                on <span className="font-medium text-gray-800">{selectedDate}</span>{" "}
                has been confirmed.
              </p>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
