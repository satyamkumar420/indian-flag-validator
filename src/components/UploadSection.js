import { useRef } from "react";
import { Upload, FileImage, CheckCircle } from "lucide-react";
import Image from "next/image";

const UploadSection = ({
  selectedFile,
  previewUrl,
  isProcessing,
  handleDrop,
  handleDragOver,
  handleFileSelect,
  validateFlag,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-blue-600" />
          Upload Flag Image
        </h2>

        {/* Drop Zone */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drop your flag image here or{" "}
            <span className="text-blue-600 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-400">
            Supports PNG, JPG, SVG (Max 5MB)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <Image
              src={previewUrl}
              alt="Flag preview"
              className="w-full h-32 object-contain bg-gray-50 rounded-lg border"
              width={100}
              height={100}
            />
          </div>
        )}

        {/* Validate Button */}
        <button
          onClick={validateFlag}
          disabled={!selectedFile || isProcessing}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Validate Flag
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
