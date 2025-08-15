import { Download, Flag } from "lucide-react";
import { ResultCard } from "./ui/ResultCard";
import { StatusIcon } from "./ui/StatusIcon";

const ResultsSection = ({ validationResult, downloadReport }) => {
  if (!validationResult) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
          <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready for Validation
          </h3>
          <p className="text-gray-600 mb-6">
            Upload an Indian flag image to start the BIS compliance validation
            process.
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-16 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded border shadow-sm flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 border border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Validation Results
          </h2>
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>

        <div className="space-y-6">
          <ResultCard
            title="Aspect Ratio"
            status={validationResult.aspect_ratio.status}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Actual:</span>
                <span className="ml-2 font-medium">
                  {validationResult.aspect_ratio.actual}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Expected:</span>
                <span className="ml-2 font-medium">
                  {validationResult.aspect_ratio.expected}
                </span>
              </div>
            </div>
          </ResultCard>

          <ResultCard title="Color Accuracy">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(validationResult.colors).map(
                ([colorName, colorData]) => (
                  <div key={colorName} className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize font-medium text-gray-900">
                        {colorName.replace("_", " ")}
                      </span>
                      <StatusIcon status={colorData.status} />
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="text-gray-600">
                        Deviation:{" "}
                        <span className="font-medium">
                          {colorData.deviation}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        Actual:{" "}
                        <span className="font-medium">{colorData.actual}</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </ResultCard>

          <ResultCard
            title="Stripe Proportions"
            status={validationResult.stripe_proportion.status}
          >
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-full h-4 bg-orange-500 rounded mb-2"></div>
                <span className="text-gray-600">
                  Top: {validationResult.stripe_proportion.top}
                </span>
              </div>
              <div className="text-center">
                <div className="w-full h-4 bg-white border rounded mb-2"></div>
                <span className="text-gray-600">
                  Middle: {validationResult.stripe_proportion.middle}
                </span>
              </div>
              <div className="text-center">
                <div className="w-full h-4 bg-green-700 rounded mb-2"></div>
                <span className="text-gray-600">
                  Bottom: {validationResult.stripe_proportion.bottom}
                </span>
              </div>
            </div>
          </ResultCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              title="Chakra Position"
              status={validationResult.chakra_position.status}
            >
              <div className="text-sm space-y-1">
                <div className="text-gray-600">
                  X Offset:{" "}
                  <span className="font-medium">
                    {validationResult.chakra_position.offset_x}
                  </span>
                </div>
                <div className="text-gray-600">
                  Y Offset:{" "}
                  <span className="font-medium">
                    {validationResult.chakra_position.offset_y}
                  </span>
                </div>
              </div>
            </ResultCard>

            <ResultCard
              title="Chakra Spokes"
              status={validationResult.chakra_spokes.status}
            >
              <div className="text-sm space-y-1">
                <div className="text-gray-600">
                  Detected:{" "}
                  <span className="font-medium">
                    {validationResult.chakra_spokes.detected}
                  </span>
                </div>
                <div className="text-gray-600">
                  Expected:{" "}
                  <span className="font-medium">
                    {validationResult.chakra_spokes.expected}
                  </span>
                </div>
              </div>
            </ResultCard>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Image Information
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Width:</span>
                <span className="ml-2 font-medium">
                  {validationResult.image_info.width}px
                </span>
              </div>
              <div>
                <span className="text-gray-600">Height:</span>
                <span className="ml-2 font-medium">
                  {validationResult.image_info.height}px
                </span>
              </div>
              <div>
                <span className="text-gray-600">Size:</span>
                <span className="ml-2 font-medium">
                  {validationResult.image_info.file_size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
