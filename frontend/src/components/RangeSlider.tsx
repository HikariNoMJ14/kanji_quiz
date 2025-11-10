import React from 'react';

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  valueText?: string; // optional text to show alongside label (e.g., formatted value)
}

const RangeSlider: React.FC<RangeSliderProps> = ({ label, min, max, value, onChange, valueText }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-white/90">
        {label}{valueText ? `: ${valueText}` : ''}
      </label>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  );
};

export default RangeSlider;
