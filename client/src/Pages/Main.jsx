import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BsPlusCircle } from 'react-icons/bs'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import Table from '../Components/Tables'
import axios from 'axios'
import axiosInstance from '../axiosIn'

export default function Main() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [status, setStatus] = useState('all')
  const [showStatusOptions, setShowStatusOptions] = useState(false)
 
  const handleDateChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    setShowStatusOptions(false)  // Statusni tanlagandan so'ng variantlar yopiladi
  }

  return (
    <>
      <div className='p-[55px_0px_0px_46px] main'>
        <div className='flex  gap-[15px] mb-[65px]'>
          <button className='border-[1px] border-[#EFEBF6] min-h-[58px] flex justify-start items-center gap-[17px] rounded-[--CornerSmall] p-[18px_22px] text-[#000000] bg-[#EFEBF6]'>
            <BsPlusCircle className='text-[22px]' />
            <p className='text-[22px] font-[400] leading-[26px]'>Add new work</p>
          </button>
          <button className='border-[1px] border-[#EFEBF6] min-h-[58px] flex justify-start items-center rounded-[--CornerSmall] p-[0px_14px]'>
            <input
              placeholder='Search by name'
              type="search"
              className='text-[22px] min-h-[58px] flex justify-start items-center rounded-[--CornerSmall]  bg-transparent border-transparent' />
            <AiOutlineSearch className='text-[22px]' />
          </button>
          <div className='relative'>
            <button 
              onClick={() => setShowStatusOptions(!showStatusOptions)} 
              className='border-[1px] border-[#EFEBF6] min-h-[58px] flex justify-start items-center rounded-[--CornerSmall] text-[22px] font-[400] leading-[26px] p-[18px_11px] bg-[#0c0814]'>
              {`By status - ${status}`}
            </button>
            {showStatusOptions && (
              <div className='absolute  mt-1 z-50 p-[10px] min-w-[163px] border border-[#EFEBF6] rounded-[--CornerSmall] bg-[#0c0814]'>
                <div onClick={() => handleStatusChange('all')} className='cursor-pointer p-[10px] '>All</div>
                <div onClick={() => handleStatusChange('other')} className='cursor-pointer p-[10px] '>Other</div>
                <div onClick={() => handleStatusChange('last')} className='cursor-pointer p-[10px] '>Last</div>
              </div>
            )}
          </div>
          <div className='relative'>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className='border-[1px] border-[#EFEBF6] min-h-[58px] flex justify-start items-center rounded-[--CornerSmall] text-[22px] font-[400] leading-[26px] p-[18px_17px]'>
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
          <button className='border-[1px] border-[#EFEBF6] min-h-[58px] flex justify-start items-center rounded-[--CornerSmall] text-[22px] font-[400] leading-[26px] p-[0px_13px]'>
            Hide Columns
          </button>
        </div>
        <Table/>
      </div>
    </>
  )
}
