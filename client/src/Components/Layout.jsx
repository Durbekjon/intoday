import React from 'react'
import Header from '../Pages/Header'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
    return (
        <>
            <div className="flex min-h-screen">
                <div className="basis-[20%] ">
                    <Sidebar />
                </div>
                <div className="basis-[80%]">
                    <Header />
                    <div className=" min-h-[100vh] p-[20px]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
