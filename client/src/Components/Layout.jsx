import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useUserFatch from '../Hooks/useUserFatch';
import SelectRole from "../Pages/SelectRole";
export default function Layout() {
    const { user, userLoading, userError } = useUserFatch();
    const selectedRole = user?.selectedRole
    return (
        selectedRole ? (<div className="flex w-full">
            <div className="w-[334px] relative ">
                <Sidebar />
            </div>
            <div className="w-full">
                <div className="main p-[0px_12px_20px_10px]">
                    <Outlet />
                </div>
            </div>
        </div>) : (
            <SelectRole />
        )
    )
}
