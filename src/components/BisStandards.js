const BisStandards = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">BIS Standards</h3>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Aspect Ratio:</span>
        <span className="font-medium">3:2 (±1%)</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Stripe Height:</span>
        <span className="font-medium">1/3 each</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Chakra Spokes:</span>
        <span className="font-medium">24 exactly</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Color Tolerance:</span>
        <span className="font-medium">±5% RGB</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900 mb-2">Official Colors</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-xs">#FF9933</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border rounded"></div>
          <span className="text-xs">#FFFFFF</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-700 rounded"></div>
          <span className="text-xs">#138808</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-900 rounded"></div>
          <span className="text-xs">#000080</span>
        </div>
      </div>
    </div>
  </div>
);

export default BisStandards;
