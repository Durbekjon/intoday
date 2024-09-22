import React, { useEffect, useState, useRef } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { AiOutlineSearch } from "react-icons/ai";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../axiosIn';
import Tables from './Tables';
import { message } from 'antd';

export default function SheetDetails({ sheet }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('all');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showStatusOptions, setShowStatusOptions] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newRow, setNewRow] = useState({ name: '', editor: '', status: '', uploadStatus: '', deadline: '', price: '', paid: false });
    const [rows, setRows] = useState([]);

    const statusRef = useRef(null);
    const dateRef = useRef(null);

    useEffect(() => {
        const savedRows = localStorage.getItem('rows');
        if (savedRows) {
            setRows(JSON.parse(savedRows));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('rows', JSON.stringify(rows));
    }, [rows]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusRef.current && !statusRef.current.contains(event.target)) {
                setShowStatusOptions(false);
            }
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        setShowStatusOptions(false);
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            setShowDatePicker(false);
        }
    };

    const handleAddRow = () => {
        const tData = {
            "name": "fwbkefb",
            "status": "new",
            //   "files": "64e2f65c89a66b001ea24f1e",
            "members": [
                "66d034e598ea3c82803c7c26"
            ],
            "priority": "high",
            "link": "https://example.com/designs",
            "price": 5000,
            "paid": false,
            "sheet": sheet,
        }
        try { 
            axiosInstance.post('/task', tData) 
        } catch { 
            message.error('Error adding row:'); 
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='p-[15px_0px_0px_15px] mainn'>
                <div className='flex gap-[10px] mb-[40px] justify-start items-center'>
                    <button
                        onClick={handleAddRow}
                        className='border-[1px] border-[#EFEBF6] flex justify-start items-center gap-[8px] rounded-[6px] p-[8px_12px] text-[#000000] bg-[#EFEBF6]'
                    >
                        <BsPlusCircle className='text-[16px]' />
                        <p className='text-[16px] font-[400] leading-[22px]'>Add new work</p>
                    </button>
                    <button className='border-[1px] border-[#EFEBF6] flex justify-start items-center rounded-[6px] p-[8px_10px]'>
                        <input
                            placeholder='Search by name'
                            type="search"
                            className='text-[16px] flex justify-start items-center rounded-[6px] bg-transparent border-transparent'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} />
                        <AiOutlineSearch className='text-[14px]' />
                    </button>
                    <div className='relative' ref={statusRef}>
                        <button
                            onClick={() => setShowStatusOptions(!showStatusOptions)}
                            className='border-[1px] border-[#EFEBF6] flex justify-start items-center rounded-[6px] text-[16px] font-[400] leading-[22px] p-[8px_10px] bg-[#0c0814]'
                        >
                            {`By status - ${status}`}
                        </button>
                        {showStatusOptions && (
                            <div className='absolute mt-1 z-50 p-[8px] min-w-[130px] border border-[#EFEBF6] rounded-[6px] bg-[#0c0814]'>
                                <div onClick={() => handleStatusChange('all')} className='cursor-pointer p-[8px] '>All</div>
                                <div onClick={() => handleStatusChange('other')} className='cursor-pointer p-[8px] '>Other</div>
                                <div onClick={() => handleStatusChange('last')} className='cursor-pointer p-[8px] '>Last</div>
                            </div>
                        )}
                    </div>
                    <div className='relative' ref={dateRef}>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className='border-[1px] border-[#EFEBF6] flex justify-start items-center rounded-[6px] text-[16px] font-[400] leading-[22px] p-[8px_14px]'
                        >
                            {`By date ${startDate && endDate
                                ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                : ''
                                }`}
                        </button>
                        {showDatePicker && (
                            <div className='absolute top-full mt-1 z-50'>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                />
                            </div>
                        )}
                    </div>
                    <button className='border-[1px] border-[#EFEBF6] flex justify-start items-center rounded-[6px] text-[16px] font-[400] leading-[22px] p-[8px_10px]'>
                        Hide Columns
                    </button>
                </div>
                <Tables rows={rows} setRows={setRows} />
            </div>
        </>
    );
}
