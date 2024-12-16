import React from 'react';

interface PcSetting {
  captureInterval: number;
}

interface CustomDropdownProps {
  index: number;
  pc: PcSetting;
  handlePcChange: (
    index: number,
    field: keyof PcSetting,
    value: number,
  ) => void;
  showHelp: (message: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  index,
  pc,
  handlePcChange,
  showHelp,
}) => {
  const options = [
    5, 10, 15, 20, 30, 60, 120, 180, 300, 600, 1200, 1800, 3600, 7200, 10800,
  ];

  const formatTime = (value: number) => {
    if (value < 60) {
      return `${value} Seconds`;
    } else if (value >= 60 && value < 3600) {
      return `${value / 60} Minutes`;
    } else {
      return `${value / 3600} Hours`;
    }
  };

  return (
    <div className="relative">
      <select
        value={pc.captureInterval}
        onChange={(e) => {
          const selectedValue = parseInt(e.target.value, 10);
          handlePcChange(index, 'captureInterval', selectedValue);
          showHelp(`Capture Interval: ${formatTime(selectedValue)}`);
        }}
        onMouseEnter={() => showHelp('Select the desired capture interval.')}
        onMouseLeave={() => showHelp('')}
        className="p-2 border rounded"
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomDropdown;
