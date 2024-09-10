import React from 'react'
import { IoMdSettings } from 'react-icons/io'
import Workspace from './Workspace'
import Employees from './Employees'
import Viewers from './Viewers'
import { Link } from 'react-router-dom'
import imglogo from "../IMG/logo.png"

export default function Sidebar() {
    return (
        <div className= 'w-full min-h-[100vh] border-r-[1px] border-[#1F1E1E] p-[32px_20px_30px] flex flex-col'>
            <div className='flex-grow'>
                <Link to={"/home"}>
                    <div className='flex justify-start items-center bg-[#24114B] p-[29px_21px] gap-[23px] rounded-[6px]'>
                        <img
                            className='w-[36px] h-[36px] '
                            src={imglogo} alt="" />
                        <h1 className='text-[30px] font-[700] leading-[35.16px]'>LOGO.UZ</h1>
                    </div>
                    <Workspace />
                    <Employees />
                    <Viewers />
                </Link>
            </div>
            <button className='flex justify-start items-center bg-[#EFEBF6] text-[#0C0814] w-full min-h-[66px] rounded-[9px] p-[20px] gap-[10px] mt-[auto]'>
                <IoMdSettings />
                <h1>Settings</h1>
            </button>
        </div>
    )
}
