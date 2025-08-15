import { Flag } from "lucide-react";

const Header = () => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center">
            <Flag className="w-6 h-6 text-blue-800" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🇮🇳 Indian Flag Validator
            </h1>
            <p className="text-sm text-gray-600">
              BIS Specification Compliance Checker
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Independence Day Coding Challenge
          </p>
          <p className="text-xs text-gray-400">
            Powered by Bureau of Indian Standards
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
