import { useState, useEffect } from "react";

interface CircularProgressBarProps {
  title: string;
  usage: number;
  limit: number;
}

export default function CircularProgressBar({
  title,
  usage,
  limit,
}: CircularProgressBarProps) {
  const [realValue] = useState(Number(((usage / limit) * 100).toFixed(0)));
  const [progress, setProgress] = useState(0);
  const [fraction] = useState({ numerator: usage, denominator: limit });

  // Calculate values for SVG
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Number(progress) / 100);

  // Circle appearance
  const strokeWidth = 12;
  const innerRadius = radius - strokeWidth / 2;

  //Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prev) => Math.min(prev + 1, realValue));
    }, 20);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-6 text-gray-700">{title}</h2>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={innerRadius}
            fill="transparent"
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={innerRadius}
            fill="transparent"
            stroke="#006FEE"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center">
          <div className="text-4xl font-bold text-gray-800">{progress}%</div>
          <div className="font-medium text-gray-600 mt-2">
            {fraction.numerator}/{fraction.denominator}
          </div>
        </div>
      </div>
    </div>
  );
}
