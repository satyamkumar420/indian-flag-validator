"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import ResultsSection from "@/components/ResultsSection";
import BisStandards from "@/components/BisStandards";
import Footer from "@/components/Footer";

// BIS Color Standards
const BIS_COLORS = {
  saffron: { hex: "#FF9933", rgb: [255, 153, 51] },
  white: { hex: "#FFFFFF", rgb: [255, 255, 255] },
  green: { hex: "#138808", rgb: [19, 136, 8] },
  chakra_blue: { hex: "#000080", rgb: [0, 0, 128] },
};

// Default validation result structure
const getDefaultValidationResult = () => ({
  aspect_ratio: {
    status: "fail",
    actual: "0.00",
    expected: "1.50",
    deviation: "100%",
  },
  colors: {
    saffron: {
      status: "fail",
      deviation: "100%",
      actual: "rgb(0, 0, 0)",
      expected: `rgb(${BIS_COLORS.saffron.rgb.join(", ")})`,
    },
    white: {
      status: "fail",
      deviation: "100%",
      actual: "rgb(0, 0, 0)",
      expected: `rgb(${BIS_COLORS.white.rgb.join(", ")})`,
    },
    green: {
      status: "fail",
      deviation: "100%",
      actual: "rgb(0, 0, 0)",
      expected: `rgb(${BIS_COLORS.green.rgb.join(", ")})`,
    },
    chakra_blue: {
      status: "fail",
      deviation: "100%",
      actual: "rgb(0, 0, 0)",
      expected: `rgb(${BIS_COLORS.chakra_blue.rgb.join(", ")})`,
    },
  },
  stripe_proportion: {
    status: "fail",
    saffron: "0.000",
    white: "0.000",
    green: "0.000",
    expected: "0.333",
    deviation: "0.333",
  },
  chakra_position: {
    status: "fail",
    offset_x: "0px",
    offset_y: "0px",
    center: "(0, 0)",
    expected_center: "(0, 0)",
  },
  chakra_spokes: {
    status: "fail",
    detected: 0,
    expected: 24,
    confidence: 0,
  },
  image_info: {
    width: 0,
    height: 0,
    file_size: "0.00 MB",
  },
  error: null,
});

const IndianFlagValidator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    try {
      const file = event?.target?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
        setValidationResult(null);

        // Clean up previous URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handleDrop = (event) => {
    try {
      event.preventDefault();
      const file = event?.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
        setValidationResult(null);

        // Clean up previous URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Safe color distance calculation
  const colorDistance = (color1, color2) => {
    if (
      !color1 ||
      !color2 ||
      !Array.isArray(color1) ||
      !Array.isArray(color2)
    ) {
      return 441.67; // Maximum possible distance for RGB colors
    }

    if (color1.length !== 3 || color2.length !== 3) {
      return 441.67;
    }

    try {
      const r1 = Number(color1[0]) || 0;
      const g1 = Number(color1[1]) || 0;
      const b1 = Number(color1[2]) || 0;

      const r2 = Number(color2[0]) || 0;
      const g2 = Number(color2[1]) || 0;
      const b2 = Number(color2[2]) || 0;

      return Math.sqrt(
        Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
      );
    } catch (error) {
      console.error("Error calculating color distance:", error);
      return 441.67;
    }
  };

  const getColorDeviation = (actualColor, expectedColor) => {
    if (!actualColor || !expectedColor) return 100;

    try {
      const maxDistance = Math.sqrt(3 * Math.pow(255, 2));
      const distance = colorDistance(actualColor, expectedColor);
      return Math.min(
        100,
        Math.max(0, Math.round((distance / maxDistance) * 100))
      );
    } catch (error) {
      console.error("Error calculating color deviation:", error);
      return 100;
    }
  };

  // Safe color classification with strict flag color detection
  const classifyPixelColor = (r, g, b) => {
    try {
      // Normalize and validate input values
      r = Math.max(0, Math.min(255, Number(r) || 0));
      g = Math.max(0, Math.min(255, Number(g) || 0));
      b = Math.max(0, Math.min(255, Number(b) || 0));

      // Very strict white detection for flag
      if (
        r > 220 &&
        g > 220 &&
        b > 220 &&
        Math.abs(r - g) < 20 &&
        Math.abs(g - b) < 20 &&
        Math.abs(r - b) < 20
      ) {
        return "white";
      }

      // Strict saffron detection (Indian flag orange)
      if (
        r >= 200 &&
        r <= 255 &&
        g >= 100 &&
        g <= 180 &&
        b >= 20 &&
        b <= 80 &&
        r > g &&
        g > b &&
        r - g > 50
      ) {
        return "saffron";
      }

      // Strict green detection (Indian flag green)
      if (
        g >= 100 &&
        g <= 200 &&
        r >= 10 &&
        r <= 80 &&
        b >= 5 &&
        b <= 50 &&
        g > r &&
        g > b &&
        g - r > 40
      ) {
        return "green";
      }

      // Enhanced chakra blue detection
      const isBlue =
        (b >= 100 && b <= 180 && r <= 50 && g <= 50) ||
        (b >= 120 && b <= 220 && r <= 100 && g <= 120 && b > Math.max(r, g)) ||
        (b >= 150 &&
          b <= 255 &&
          r >= 80 &&
          r <= 180 &&
          g >= 100 &&
          g <= 200 &&
          b > r &&
          b > g) ||
        (b >= 180 && b <= 255 && r <= 100 && g >= 100 && g <= 200 && b > r);

      if (isBlue) {
        return "blue";
      }

      return "unknown";
    } catch (error) {
      console.error("Error classifying pixel color:", error);
      return "unknown";
    }
  };

  // Safe stripe detection with flag validation
  const detectStripeRegions = (pixels, width, height) => {
    const defaultRegions = {
      saffron: { start: 0, end: Math.floor(height / 3) },
      white: {
        start: Math.floor(height / 3),
        end: Math.floor((height * 2) / 3),
      },
      green: { start: Math.floor((height * 2) / 3), end: height },
      isValidFlag: false,
      flagLikeRatio: 0,
    };

    if (!pixels || !width || !height || pixels.length < width * height * 4) {
      return defaultRegions;
    }

    try {
      const horizontalScans = [];
      const scanCount = Math.min(50, height);

      for (let scanLine = 0; scanLine < scanCount; scanLine++) {
        const y = Math.floor((scanLine * height) / scanCount);
        const colorCounts = {
          saffron: 0,
          white: 0,
          green: 0,
          blue: 0,
          unknown: 0,
        };

        const sampleWidth = Math.floor(width * 0.8);
        const startX = Math.floor(width * 0.1);

        for (
          let x = startX;
          x < startX + sampleWidth;
          x += Math.max(1, Math.floor(sampleWidth / 25))
        ) {
          const pixelIndex = (y * width + x) * 4;

          if (pixelIndex + 2 < pixels.length) {
            const r = pixels[pixelIndex] || 0;
            const g = pixels[pixelIndex + 1] || 0;
            const b = pixels[pixelIndex + 2] || 0;

            const colorType = classifyPixelColor(r, g, b);
            colorCounts[colorType]++;
          }
        }

        const totalPixels = Object.values(colorCounts).reduce(
          (a, b) => a + b,
          0
        );

        if (totalPixels === 0) continue;

        const dominantColor = Object.keys(colorCounts).reduce((a, b) =>
          colorCounts[a] > colorCounts[b] ? a : b
        );

        const confidence = colorCounts[dominantColor] / totalPixels;
        const isValidFlagColor = ["saffron", "white", "green"].includes(
          dominantColor
        );

        horizontalScans.push({
          y: y,
          dominantColor: dominantColor,
          confidence: confidence,
          isValidFlagColor: isValidFlagColor,
          flagColorRatio:
            (colorCounts.saffron + colorCounts.white + colorCounts.green) /
            totalPixels,
        });
      }

      if (horizontalScans.length === 0) {
        return defaultRegions;
      }

      // Check if this looks like an Indian flag
      const validFlagScans = horizontalScans.filter(
        (scan) =>
          scan.isValidFlagColor &&
          scan.confidence > 0.4 &&
          scan.flagColorRatio > 0.6
      );

      const flagLikeRatio = validFlagScans.length / horizontalScans.length;
      const isLikelyFlag = flagLikeRatio > 0.6;

      if (!isLikelyFlag) {
        return { ...defaultRegions, flagLikeRatio };
      }

      // Find stripe boundaries for valid flag
      const regions = { saffron: [], white: [], green: [] };
      let currentRegion = null;
      let regionStart = 0;

      for (let i = 0; i < validFlagScans.length; i++) {
        const scan = validFlagScans[i];

        if (scan.dominantColor !== currentRegion) {
          if (currentRegion && regions[currentRegion]) {
            regions[currentRegion].push({ start: regionStart, end: scan.y });
          }
          currentRegion = scan.dominantColor;
          regionStart = scan.y;
        }
      }

      if (currentRegion && regions[currentRegion]) {
        regions[currentRegion].push({ start: regionStart, end: height });
      }

      // Validate that we have all three colors
      const hasAllColors =
        regions.saffron.length > 0 &&
        regions.white.length > 0 &&
        regions.green.length > 0;

      if (!hasAllColors) {
        return { ...defaultRegions, flagLikeRatio };
      }

      // Find the largest region for each color
      const mainRegions = {};
      ["saffron", "white", "green"].forEach((color) => {
        if (regions[color] && regions[color].length > 0) {
          mainRegions[color] = regions[color].reduce((largest, current) => {
            const currentSize = current.end - current.start;
            const largestSize = largest.end - largest.start;
            return currentSize > largestSize ? current : largest;
          });
        } else {
          // Fallback to default regions
          const stripeHeight = height / 3;
          if (color === "saffron") {
            mainRegions[color] = { start: 0, end: stripeHeight };
          } else if (color === "white") {
            mainRegions[color] = { start: stripeHeight, end: stripeHeight * 2 };
          } else {
            mainRegions[color] = { start: stripeHeight * 2, end: height };
          }
        }
      });

      return {
        ...mainRegions,
        isValidFlag: true,
        flagLikeRatio: flagLikeRatio,
      };
    } catch (error) {
      console.error("Error detecting stripe regions:", error);
      return defaultRegions;
    }
  };

  // Safe color sampling
  const sampleRegionColor = (pixels, width, height, region) => {
    const defaultColor = [128, 128, 128]; // Gray fallback

    if (!pixels || !width || !height || !region) {
      return defaultColor;
    }

    try {
      if (
        region.start >= region.end ||
        region.start < 0 ||
        region.end > height
      ) {
        return defaultColor;
      }

      const samples = [];
      const regionHeight = region.end - region.start;

      if (regionHeight <= 0) {
        return defaultColor;
      }

      const sampleArea = {
        startY: Math.floor(region.start + regionHeight * 0.25),
        endY: Math.floor(region.end - regionHeight * 0.25),
        startX: Math.floor(width * 0.2),
        endX: Math.floor(width * 0.8),
      };

      // Ensure valid bounds
      sampleArea.startY = Math.max(0, Math.min(height - 1, sampleArea.startY));
      sampleArea.endY = Math.max(0, Math.min(height - 1, sampleArea.endY));
      sampleArea.startX = Math.max(0, Math.min(width - 1, sampleArea.startX));
      sampleArea.endX = Math.max(0, Math.min(width - 1, sampleArea.endX));

      if (
        sampleArea.startY >= sampleArea.endY ||
        sampleArea.startX >= sampleArea.endX
      ) {
        return defaultColor;
      }

      // Collect multiple samples
      const stepY = Math.max(1, Math.floor(regionHeight / 10));
      const stepX = Math.max(1, Math.floor(width / 15));

      for (let y = sampleArea.startY; y < sampleArea.endY; y += stepY) {
        for (let x = sampleArea.startX; x < sampleArea.endX; x += stepX) {
          const pixelIndex = (y * width + x) * 4;
          if (pixelIndex + 2 < pixels.length && pixelIndex >= 0) {
            samples.push([
              pixels[pixelIndex] || 0,
              pixels[pixelIndex + 1] || 0,
              pixels[pixelIndex + 2] || 0,
            ]);
          }
        }
      }

      if (samples.length === 0) {
        return defaultColor;
      }

      // Calculate median color (more robust than mean)
      const sortedR = samples.map((s) => s[0]).sort((a, b) => a - b);
      const sortedG = samples.map((s) => s[1]).sort((a, b) => a - b);
      const sortedB = samples.map((s) => s[2]).sort((a, b) => a - b);

      const medianIndex = Math.floor(samples.length / 2);

      return [
        sortedR[medianIndex] || 0,
        sortedG[medianIndex] || 0,
        sortedB[medianIndex] || 0,
      ];
    } catch (error) {
      console.error("Error sampling region color:", error);
      return defaultColor;
    }
  };

  // Safe chakra detection
  const detectChakra = (pixels, width, height, whiteRegion, isValidFlag) => {
    const defaultChakra = {
      center: { x: Math.floor(width / 2) || 0, y: Math.floor(height / 2) || 0 },
      color: [0, 0, 128],
      radius: Math.min(width || 100, height || 100) * 0.08,
      expectedCenter: {
        x: Math.floor(width / 2) || 0,
        y: Math.floor(height / 2) || 0,
      },
      foundChakra: false,
      bluePixelCount: 0,
    };

    if (!pixels || !width || !height || !whiteRegion || !isValidFlag) {
      return defaultChakra;
    }

    try {
      const whiteCenterY = Math.floor(
        (whiteRegion.start + whiteRegion.end) / 2
      );
      const expectedCenterX = Math.floor(width / 2);
      const searchRadius = Math.min(width, height) * 0.15;

      let bestCenter = { x: expectedCenterX, y: whiteCenterY };
      let bestScore = 0;
      let totalBluePixels = 0;

      // Search for chakra center
      const stepSize = Math.max(1, Math.floor(searchRadius / 20));

      for (
        let cy = Math.max(0, whiteCenterY - searchRadius);
        cy <= Math.min(height - 1, whiteCenterY + searchRadius);
        cy += stepSize
      ) {
        for (
          let cx = Math.max(0, expectedCenterX - searchRadius);
          cx <= Math.min(width - 1, expectedCenterX + searchRadius);
          cx += stepSize
        ) {
          let blueScore = 0;
          let localBluePixels = 0;
          let sampleCount = 0;

          const testRadius = Math.min(width, height) * 0.04;

          for (
            let ty = Math.max(0, cy - testRadius);
            ty <= Math.min(height - 1, cy + testRadius);
            ty += 1
          ) {
            for (
              let tx = Math.max(0, cx - testRadius);
              tx <= Math.min(width - 1, cx + testRadius);
              tx += 1
            ) {
              const pixelIndex = (ty * width + tx) * 4;
              if (pixelIndex + 2 < pixels.length && pixelIndex >= 0) {
                const r = pixels[pixelIndex] || 0;
                const g = pixels[pixelIndex + 1] || 0;
                const b = pixels[pixelIndex + 2] || 0;

                if (classifyPixelColor(r, g, b) === "blue") {
                  blueScore += b - Math.max(r, g) + 50;
                  localBluePixels++;
                }
                sampleCount++;
              }
            }
          }

          totalBluePixels += localBluePixels;

          if (sampleCount > 0 && localBluePixels > 5) {
            const avgScore = blueScore / sampleCount;
            if (avgScore > bestScore) {
              bestScore = avgScore;
              bestCenter = { x: cx, y: cy };
            }
          }
        }
      }

      // Sample chakra color from best center
      const chakraPixelIndex = (bestCenter.y * width + bestCenter.x) * 4;
      const chakraColor = [
        pixels[chakraPixelIndex] || 0,
        pixels[chakraPixelIndex + 1] || 0,
        pixels[chakraPixelIndex + 2] || 128,
      ];

      const foundChakra = totalBluePixels > width * height * 0.001;

      return {
        center: bestCenter,
        color: chakraColor,
        radius: Math.min(width, height) * 0.08,
        expectedCenter: { x: expectedCenterX, y: whiteCenterY },
        foundChakra: foundChakra,
        bluePixelCount: totalBluePixels,
      };
    } catch (error) {
      console.error("Error detecting chakra:", error);
      return defaultChakra;
    }
  };

  // Safe spoke detection
  const detectSpokes = (pixels, width, height, chakraCenter, chakraRadius) => {
    if (!pixels || !width || !height || !chakraCenter || !chakraRadius) {
      return 1; // Minimum spoke count
    }

    try {
      let spokeTransitions = 0;
      const angleStep = 2;
      let prevIntensity = null;
      const intensityThreshold = 25;

      for (let angle = 0; angle < 360; angle += angleStep) {
        const radians = (angle * Math.PI) / 180;
        const x = Math.round(chakraCenter.x + Math.cos(radians) * chakraRadius);
        const y = Math.round(chakraCenter.y + Math.sin(radians) * chakraRadius);

        if (x >= 0 && x < width && y >= 0 && y < height) {
          const pixelIndex = (y * width + x) * 4;
          if (pixelIndex + 2 < pixels.length && pixelIndex >= 0) {
            const r = pixels[pixelIndex] || 0;
            const g = pixels[pixelIndex + 1] || 0;
            const b = pixels[pixelIndex + 2] || 0;

            const intensity = (r + g + b) / 3;

            if (
              prevIntensity !== null &&
              Math.abs(intensity - prevIntensity) > intensityThreshold
            ) {
              spokeTransitions++;
            }

            prevIntensity = intensity;
          }
        }
      }

      let estimatedSpokes = Math.round(spokeTransitions / 2);

      if (estimatedSpokes > 24)
        estimatedSpokes = Math.round(estimatedSpokes * 0.8);
      if (estimatedSpokes < 10)
        estimatedSpokes = Math.round(estimatedSpokes * 1.5);

      return Math.max(1, Math.min(24, estimatedSpokes));
    } catch (error) {
      console.error("Error detecting spokes:", error);
      return 1;
    }
  };

  const analyzeImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        reject(new Error("No image file provided"));
        return;
      }

      const img = new window.Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      img.onload = () => {
        try {
          // Validate image dimensions
          if (!img.width || !img.height || img.width < 10 || img.height < 10) {
            reject(new Error("Invalid image dimensions"));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const pixels = imageData.data;

          if (!pixels || pixels.length === 0) {
            reject(new Error("Could not extract pixel data"));
            return;
          }

          // Initialize result with default structure
          const result = getDefaultValidationResult();

          // Update image info
          result.image_info = {
            width: img.width,
            height: img.height,
            file_size: `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`,
          };

          try {
            // 1. Aspect Ratio Analysis
            const aspectRatio = img.width / img.height;
            const expectedRatio = 3 / 2;
            const aspectRatioPass =
              Math.abs(aspectRatio - expectedRatio) <= 0.05;

            result.aspect_ratio = {
              status: aspectRatioPass ? "pass" : "fail",
              actual: aspectRatio.toFixed(2),
              expected: "1.50",
              deviation: `${Math.abs(
                ((aspectRatio - expectedRatio) / expectedRatio) * 100
              ).toFixed(1)}%`,
            };

            // 2. Detect stripe regions
            const stripeRegions = detectStripeRegions(
              pixels,
              img.width,
              img.height
            );

            // 3. Sample colors from each stripe
            const saffronColor = sampleRegionColor(
              pixels,
              img.width,
              img.height,
              stripeRegions.saffron
            );
            const whiteColor = sampleRegionColor(
              pixels,
              img.width,
              img.height,
              stripeRegions.white
            );
            const greenColor = sampleRegionColor(
              pixels,
              img.width,
              img.height,
              stripeRegions.green
            );

            // 4. Calculate color deviations
            const saffronDeviation = getColorDeviation(
              saffronColor,
              BIS_COLORS.saffron.rgb
            );
            const whiteDeviation = getColorDeviation(
              whiteColor,
              BIS_COLORS.white.rgb
            );
            const greenDeviation = getColorDeviation(
              greenColor,
              BIS_COLORS.green.rgb
            );

            result.colors = {
              saffron: {
                status: saffronDeviation <= 20 ? "pass" : "fail",
                deviation: `${saffronDeviation}%`,
                actual: `rgb(${saffronColor.join(", ")})`,
                expected: `rgb(${BIS_COLORS.saffron.rgb.join(", ")})`,
              },
              white: {
                status: whiteDeviation <= 15 ? "pass" : "fail",
                deviation: `${whiteDeviation}%`,
                actual: `rgb(${whiteColor.join(", ")})`,
                expected: `rgb(${BIS_COLORS.white.rgb.join(", ")})`,
              },
              green: {
                status: greenDeviation <= 20 ? "pass" : "fail",
                deviation: `${greenDeviation}%`,
                actual: `rgb(${greenColor.join(", ")})`,
                expected: `rgb(${BIS_COLORS.green.rgb.join(", ")})`,
              },
            };

            // 5. Calculate stripe proportions
            const saffronHeight = stripeRegions.saffron
              ? stripeRegions.saffron.end - stripeRegions.saffron.start
              : 0;
            const whiteHeight = stripeRegions.white
              ? stripeRegions.white.end - stripeRegions.white.start
              : 0;
            const greenHeight = stripeRegions.green
              ? stripeRegions.green.end - stripeRegions.green.start
              : 0;
            const totalHeight = img.height;

            const saffronProportion =
              totalHeight > 0 ? saffronHeight / totalHeight : 0;
            const whiteProportion =
              totalHeight > 0 ? whiteHeight / totalHeight : 0;
            const greenProportion =
              totalHeight > 0 ? greenHeight / totalHeight : 0;

            const proportionCheck =
              Math.abs(saffronProportion - 1 / 3) < 0.08 &&
              Math.abs(whiteProportion - 1 / 3) < 0.08 &&
              Math.abs(greenProportion - 1 / 3) < 0.08;

            result.stripe_proportion = {
              status: proportionCheck ? "pass" : "fail",
              saffron: saffronProportion.toFixed(3),
              white: whiteProportion.toFixed(3),
              green: greenProportion.toFixed(3),
              expected: "0.333",
              deviation: Math.max(
                Math.abs(saffronProportion - 1 / 3),
                Math.abs(whiteProportion - 1 / 3),
                Math.abs(greenProportion - 1 / 3)
              ).toFixed(3),
            };

            // 6. Chakra analysis
            const chakraData = detectChakra(
              pixels,
              img.width,
              img.height,
              stripeRegions.white,
              stripeRegions.isValidFlag
            );
            const chakraDeviation = getColorDeviation(
              chakraData.color,
              BIS_COLORS.chakra_blue.rgb
            );

            result.colors.chakra_blue = {
              status: chakraDeviation <= 25 ? "pass" : "fail",
              deviation: `${chakraDeviation}%`,
              actual: `rgb(${chakraData.color.join(", ")})`,
              expected: `rgb(${BIS_COLORS.chakra_blue.rgb.join(", ")})`,
            };

            // 7. Spoke detection
            const detectedSpokes = detectSpokes(
              pixels,
              img.width,
              img.height,
              chakraData.center,
              chakraData.radius
            );

            result.chakra_spokes = {
              status: Math.abs(detectedSpokes - 24) <= 3 ? "pass" : "fail",
              detected: detectedSpokes,
              expected: 24,
              confidence: Math.max(0, 100 - Math.abs(detectedSpokes - 24) * 4),
            };

            // 8. Position accuracy
            const offsetX =
              (chakraData.center?.x || 0) - (chakraData.expectedCenter?.x || 0);
            const offsetY =
              (chakraData.center?.y || 0) - (chakraData.expectedCenter?.y || 0);
            const positionAccuracy =
              Math.sqrt(offsetX * offsetX + offsetY * offsetY) < 30;

            result.chakra_position = {
              status: positionAccuracy ? "pass" : "fail",
              offset_x: `${offsetX}px`,
              offset_y: `${offsetY}px`,
              center: `(${chakraData.center?.x || 0}, ${
                chakraData.center?.y || 0
              })`,
              expected_center: `(${chakraData.expectedCenter?.x || 0}, ${
                chakraData.expectedCenter?.y || 0
              })`,
            };

            resolve(result);
          } catch (analysisError) {
            console.error("Analysis error:", analysisError);
            const errorResult = getDefaultValidationResult();
            errorResult.error = `Analysis failed: ${analysisError.message}`;
            errorResult.image_info = {
              width: img.width || 0,
              height: img.height || 0,
              file_size: `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`,
            };
            resolve(errorResult);
          }
        } catch (error) {
          console.error("Canvas processing error:", error);
          reject(new Error(`Image processing failed: ${error.message}`));
        }
      };

      img.onerror = (error) => {
        console.error("Image loading error:", error);
        reject(new Error("Failed to load image file"));
      };

      try {
        const url = URL.createObjectURL(imageFile);
        img.src = url;

        // Clean up URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 5000);
      } catch (error) {
        console.error("Error creating object URL:", error);
        reject(new Error("Failed to process image file"));
      }
    });
  };

  const validateFlag = async () => {
    if (!selectedFile) {
      console.warn("No file selected for validation");
      return;
    }

    setIsProcessing(true);

    try {
      // Add processing delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await analyzeImage(selectedFile);
      setValidationResult(result);
    } catch (error) {
      console.error("Validation error:", error);

      const errorResult = getDefaultValidationResult();
      errorResult.error = error.message || "Failed to process image";
      setValidationResult(errorResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReport = () => {
    if (!validationResult) {
      console.warn("No validation result to download");
      return;
    }

    try {
      const dataStr = JSON.stringify(validationResult, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = `indian-flag-validation-${Date.now()}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.style.display = "none";

      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  // Clean up preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <UploadSection
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              isProcessing={isProcessing}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              handleFileSelect={handleFileSelect}
              validateFlag={validateFlag}
            />
            <BisStandards />
          </div>
          <ResultsSection
            validationResult={validationResult}
            downloadReport={downloadReport}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IndianFlagValidator;
