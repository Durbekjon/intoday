import React, { useRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue, bgColor) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2 border border-white rounded text-white text-left ${value ? options.find(option => option.value === value)?.bgColor : 'bg-[#0C0814]'}`}
      >
        {value || placeholder}
      </button>
      {isOpen && (
        <ul className="absolute top-full mt-2 w-full bg-[#0C0814] border border-white rounded z-50">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value, option.bgColor)}
              className={`p-2 cursor-pointer ${option.bgColor} text-white ${value === option.value ? 'font-bold' : ''}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function Tables({ rows, setRows }) {
  const [activeDatePickerIndex, setActiveDatePickerIndex] = useState(null);
  const datePickerRefs = useRef([]);
  const [allChecked, setAllChecked] = useState(false);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!datePickerRefs.current.some(ref => ref && ref.contains(event.target))) {
        setActiveDatePickerIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (dates, index) => {
    const [start, end] = dates;
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], startDate: start, endDate: end };
    setRows(updatedRows);

    // Close date picker only if both dates are selected
    if (start && end) {
      setActiveDatePickerIndex(null);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  const handleCheckboxChange = (index) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], checked: !updatedRows[index].checked };
    setRows(updatedRows);
  };

  const handleSelectAll = () => {
    const updatedRows = rows.map(row => ({ ...row, checked: !allChecked }));
    setRows(updatedRows);
    setAllChecked(!allChecked);
  };

  const statusOptions = [
    { value: 'Completed', label: 'Completed', bgColor: 'bg-green-500' },
    { value: 'Pending', label: 'Pending', bgColor: 'bg-red-500' },
  ];

  const uploadStatusOptions = [
    { value: 'Uploaded', label: 'Uploaded', bgColor: 'bg-green-500' },
    { value: 'Not Uploaded', label: 'Not Uploaded', bgColor: 'bg-gray-500' },
  ];

  const handleButtonClick = (index) => {
    setActiveDatePickerIndex(index === activeDatePickerIndex ? null : index);
  };

  return (
    <div className="">
      <table className="min-w-full bg-[#0C0814] border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-[#0C0814] border-b text-center text-white">
            <th className="p-3">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleSelectAll}
                className="form-checkbox text-white"
              />
            </th>
            <th className="p-3">Name</th>
            <th className="p-3">Editor</th>
            <th className="p-3">Status</th>
            <th className="p-3">Upload Status</th>
            <th className="p-3">Deadline</th>
            <th className="p-3">Price</th>
            <th className="p-3">Paid</th>
          </tr>
        </thead>
        <tbody className="text-center text-white">
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-gray-600">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={row.checked || false}
                  onChange={() => handleCheckboxChange(index)}
                  className="form-checkbox text-white"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="w-full p-2 border border-white rounded bg-[#0C0814] text-white"
                />
              </td>
              <td className="p-2">
                <div className="flex items-center justify-center space-x-2">
                  <img
                    src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726617600&semt=ais_hybrid"
                    alt="Editor 1"
                    className="w-8 h-8 rounded-full border border-white bg-[#0C0814]"
                  />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s"
                    alt="Editor 2"
                    className="w-8 h-8 rounded-full border border-white bg-[#0C0814]"
                  />
                  <img
                    src="https://img.pikbest.com/wp/202345/male-avatar-image-in-the-circle_9588978.jpg!sw800"
                    alt="Editor 3"
                    className="w-8 h-8 rounded-full border border-white bg-[#0C0814]"
                  />
                </div>
              </td>
              <td className="p-2">
                <CustomDropdown
                  value={row.status}
                  onChange={(value) => handleChange(index, 'status', value)}
                  options={statusOptions}
                  placeholder="Select status"
                />
              </td>
              <td className="p-2">
                <CustomDropdown
                  value={row.uploadStatus}
                  onChange={(value) => handleChange(index, 'uploadStatus', value)}
                  options={uploadStatusOptions}
                  placeholder="Select upload status"
                />
              </td>
              <td className="p-2">
                <div className="relative" ref={(el) => datePickerRefs.current[index] = el}>
                  <button
                    onClick={() => handleButtonClick(index)}
                    className="w-full p-2 border border-white rounded bg-[#0C0814] text-white"
                  >
                    {row.startDate && row.endDate
                      ? `${row.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${row.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : 'Select date range'
                    }
                  </button>
                  {activeDatePickerIndex === index && (
                    <div className="absolute top-full mt-2 z-50 bg-[#0C0814] border border-white rounded" onClick={(e) => e.stopPropagation()}>
                      <DatePicker
                        selected={row.startDate}
                        onChange={(dates) => handleDateChange(dates, index)}
                        startDate={row.startDate}
                        endDate={row.endDate}
                        selectsRange
                        inline
                        className="text-white bg-[#0C0814]"
                      />
                    </div>
                  )}
                </div>
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleChange(index, 'price', e.target.value)}
                  className="w-full p-2 border border-white rounded bg-[#0C0814] text-white"
                />
              </td>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={row.paid}
                  onChange={() => handleChange(index, 'paid', !row.paid)}
                  className="form-checkbox text-white"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
