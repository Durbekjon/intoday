import React from 'react'
import Header from '../Pages/Header'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
    return (
        <>
            <div className="flex w-full">
                <div className="w-[334px] relative ">
                    <Sidebar />
                </div>
                <div className="w-full">
                    {/* <Header/> */}
                    <div className="main p-[20px]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
