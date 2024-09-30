import React, { useRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsTrash3Fill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import axiosInstance from '../axiosIn';
import { Modal } from 'antd';

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
async function TaskUpDate(taskId, key) {

  try {
    const res = await axiosInstance.put("/task/" + taskId, key);
    console.log('Success:', res.data);
  } catch (error) {
    console.error("Error during login:", error);
  }
}

export default function Tables({ rows, setRows }) {
  const [activeDatePickerIndex, setActiveDatePickerIndex] = useState(null);
  const datePickerRefs = useRef([]);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [deleteTasks, setDeleteTasks] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmittin, setIsSubmittin] = useState(false);


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

  const handleChange = (index, field, value, id) => {
    const updatedRows = [...rows];
    const key = { field: value };
    TaskUpDate(id, key);
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  const handleCheckboxChange = (index) => {
    const updatedRows = [...rows];
    const newCheckedStatus = !updatedRows[index].checked;
    updatedRows[index] = { ...updatedRows[index], checked: !updatedRows[index].checked };
    setRows(updatedRows);

    const updatedSelectedCount = newCheckedStatus ? selectedCount + 1 : selectedCount - 1;
    setSelectedCount(updatedSelectedCount);

  };

  const handleSelectAll = () => {
    const newCheckedStatus = !allChecked;
    const updatedRows = rows.map(row => ({ ...row, checked: newCheckedStatus }));
    setRows(updatedRows);
    setAllChecked(newCheckedStatus);
    setSelectedCount(newCheckedStatus ? rows.length : 0);
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

  const handleDelete = async () => {
    try {
      setIsSubmittin(false)
      await axiosInstance.delete(`/task/${deleteTasks}`);
      setDeleteTasks(null);
      setDeleteOpen(false);
      setIsSubmittin(true);
    } catch (error) {
      console.error('Error deleting tasks:', error);
      alert('Failed to delete tasks. Please try again.');
    }
  }

  return (
    <>
      <div className="">
        <table className="min-w-full bg-[#0C0814] border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-[#0C0814] border-b text-center text-white">
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleSelectAll}
                  className="form-checkbox text-white"
                />
              </th>
              <th className="p-2">Name</th>
              <th className="p-2">Editor</th>
              <th className="p-2">Status</th>
              <th className="p-2">Upload Status</th>
              <th className="p-2">Deadline</th>
              <th className="p-2">Price</th>
              <th className="p-2">Paid</th>
            </tr>
          </thead>
          <tbody className="text-center text-white">
            {rows?.map((row, index) =>
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
                    onChange={(e) => handleChange(index, 'name', e.target.value, row._id)}
                    className="w-full p-2 border border-white rounded bg-[#0C0814] text-white"
                  />
                </td>
                <td className="p-2">
                  {row?.members?.length == 0 ? <div>no</div> : <div className="flex items-center justify-center space-x-2">
                    <img
                      src={row.members}
                      alt="Editor 1"
                      className="w-8 h-8 rounded-full border border-white bg-[#0C0814]"
                    />
                  </div>}
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
                {selectedCount > 0 && (
                  <div className='  bottom-8 right-[24%] absolute bg-[#0C0814] w-[700px] h-[60px] duration-300 border-[#3c3c3c] border-[1px] rounded-lg flex justify-between items-center'>
                    <div className='bg-[#24114B] p-[14px_22px] flex justify-center items-center rounded-[7px_0px_0px_7px] text-[20px] font-[700]'>
                      <h1>{selectedCount} </h1>
                    </div>
                    <div>
                      <h1 className='text-[20px] font-[700]'>Task selected</h1>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div
                        onClick={() => { setDeleteTasks(row._id); setDeleteOpen(true); }}
                        className='p-5 mt-[5px]  rounded-[10px] duration-300 flex justify-center items-center flex-col cursor-pointer hover:text-[red] active:opacity-30'>
                        <BsTrash3Fill className='' />
                        <h1 className='text-[10px]'>Delete</h1>
                      </div>
                      <hr className='bg-[#3c3c3c] h-12 w-[1px] border-[0.1px] border-[#3c3c3c] rounded-lg ' />
                      <div className='p-4'>
                        <IoClose className='text-[25px] cursor-pointer active:opacity-30 duration-200 ' />
                      </div>
                    </div>
                  </div>
                )}
              </tr>
            )}

          </tbody>
        </table>
      </div>
      <Modal
        title={<span className="custom-modal-title">Confirm Delete</span>}
        footer={null}
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        wrapClassName="custom-modal-wrapper"
        style={{
          maxWidth: 350,
          marginTop: 230,
          backgroundColor: 'transparent', // Modal tashqi fonini transparent qilamiz
          padding: '20px', // Ichki bo'sh joy
        }}
      >
        <div className='custom-modal-content flex flex-col'>
          <h1 className='mt-[20px] mb-[20px] text-white'>Are you sure you want to delete this Sheet?</h1>
          <div className='flex gap-4'>
            <button
              onClick={() => setDeleteOpen(false)}
              className='bg-gray-500 text-white p-2 rounded-[5px]'
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmittin}
              className={`bg-red-600 text-white p-2 rounded-[5px] ${isSubmittin ? 'opacity-50' : ''}`}
            >
              {isSubmittin ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
