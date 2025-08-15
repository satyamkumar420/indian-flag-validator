import { StatusIcon } from "./StatusIcon";

const getStatusColor = (status) => {
  switch (status) {
    case "pass":
      return "text-green-600 bg-green-50";
    case "fail":
      return "text-red-600 bg-red-50";
    default:
      return "text-yellow-600 bg-yellow-50";
  }
};

export const ResultCard = ({ title, status, children }) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {status && (
        <div className="flex items-center space-x-2">
          <StatusIcon status={status} />
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status.toUpperCase()}
          </span>
        </div>
      )}
    </div>
    {children}
  </div>
);
