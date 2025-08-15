import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const StatusIcon = ({ status }) => {
  switch (status) {
    case "pass":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "fail":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  }
};
