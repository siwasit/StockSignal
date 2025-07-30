// Databox.tsx
import React from 'react';

interface DataboxProps {
  label: string;
  value: string;
}

const Databox: React.FC<DataboxProps> = ({ label, value }) => (
  <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
    <div className="text-lg font-medium pb-1 border-b border-gray-500">{label}</div>
    <div className="text-md font-thin">{value}</div>
  </div>
);

export default Databox;
