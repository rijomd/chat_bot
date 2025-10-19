
export const SuccessIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
    </svg>
  );
};

export const WarningIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-yellow-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
};

export const ErrorIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
    </svg>
  );
};

export const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};