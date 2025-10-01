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
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
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
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2l4-4m1 2a7 7 0 11-14 0a7 7 0 0114 0z"
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
                className="mt-4 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
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
