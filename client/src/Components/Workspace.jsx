import React, { useState, useEffect, useRef } from 'react';
import { BsPlusCircle, BsThreeDotsVertical } from 'react-icons/bs';
import axiosInstance from '../axiosIn';
import { Modal } from 'antd';
import { NavLink } from "react-router-dom";

export default function Workspace() {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [newWorkspace, setNewWorkspace] = useState('');
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [deleteWorkspaceId, setDeleteWorkspaceId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittin, setIsSubmittin] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/workspace");
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateWorkspace = async () => {
        if (newWorkspace.trim() === '') {
            alert('Please enter a valid workspace name');
            return;
        }

        const newWorkspaceData = { name: newWorkspace };

        try {
            setIsSubmitting(true);
            setIsSubmittin(true);
            const res = await axiosInstance.post('/workspace', newWorkspaceData);
            setData([...data, res.data]);
            setNewWorkspace('');
            setOpen(false);
            setIsSubmitting(false);
            setIsSubmittin(false);
        } catch (error) {
            console.error('Error creating workspace:', error);
            setIsSubmitting(false);
            alert('Failed to create workspace. Please try again.');
        }
    };

    const handleEdit = async () => {
        if (!editingWorkspace || editingWorkspace.name.trim() === '') {
            alert('Please enter a valid name');
            return;
        }

        try {
            setIsSubmitting(true);
            await axiosInstance.put(`/workspace/${editingWorkspace.id}`, { name: editingWorkspace.name });
            setEditOpen(false);
            setEditingWorkspace(null);
            setIsSubmitting(false);
            fetchData();
        } catch (error) {
            console.error('Error editing workspace:', error);
            setIsSubmitting(false);
            alert('Failed to update workspace. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmittin(true);
            await axiosInstance.delete(`/workspace/${deleteWorkspaceId}`);
            setDeleteOpen(false);
            setDeleteWorkspaceId(null);
            setIsSubmittin(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting workspace:', error);
            alert('Failed to delete workspace. Please try again.');
        }
    };

    const openEditModal = (workspace) => {
        setEditingWorkspace({ id: workspace._id, name: workspace.name });
        setEditOpen(true);
    };

    const toggleMenu = (workspace) => {
        setActiveMenu(activeMenu === workspace ? null : workspace);
    };
    return (
        <>
            <h1 className='mt-[27px] mb-[16px] text-[22px] font-[400] leading-[26.4px]'>Workspace</h1>

            {loading && <p>Loading...</p>}

            {data.map((workspace, idx) => (
                <div key={idx} className='relative'>
                    <NavLink
                        to={`/home/${workspace._id}`}
                        className={({ isActive }) =>
                            `flex gap-[20px] p-[10px_21px] justify-between items-center rounded-[--CornerSmall] text-[22px] font-[400] leading-[26.4px] mt-[10px] duration-300 min-h-[46px] ${isActive ? 'bg-[#EFEBF6] text-[#0C0814]' : 'bg-[#170F28] text-[#FFFF]'}`}>
                        <div className='flex gap-[20px] items-center overflow-hidden'>
                            <h1>#</h1>
                            <h2 className='truncate '>{workspace.name}</h2>
                        </div>
                        <BsThreeDotsVertical
                            className='text-[20px] cursor-pointer'
                            onClick={() => toggleMenu(workspace)}
                        />
                        {activeMenu === workspace && (
                            <div ref={menuRef} className="absolute right-0 top-full mt-1 bg-[#EFEBF6] shadow-lg text-[#0C0814] rounded-md z-20 w-48">
                                <button
                                    onClick={() => openEditModal(workspace)}
                                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 rounded-md">
                                    Edit
                                </button>
                                <button
                                    onClick={() => { setDeleteWorkspaceId(workspace._id); setDeleteOpen(true); }}
                                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 rounded-md">
                                    Delete
                                </button>
                            </div>
                        )}
                    </NavLink>
                </div>
            ))}

            <button onClick={() => setOpen(true)} className='w-full flex justify-between items-center bg-[#EFEBF6] text-[#0C0814] p-[10px_19px] rounded-[9px] mt-[16px] min-h-[48px]'>
                <div className='flex justify-center items-center gap-[14px]'>
                    <BsPlusCircle className='text-[22px]' />
                    <h1 className='font-[400] text-[18px] leading-[21.6px]'>Add workspace</h1>
                </div>
                <p className='text-[#4C0BCD] font-[400] text-[13px] leading-[15.6px]'>pro +</p>
            </button>

            {/* Modal for creating new workspace */}
            {open && (
                <div className="fixed inset-0 bg-[#0C0814]/50 backdrop-blur-sm z-10"></div>
            )}

            <Modal
                title="Create workspace"
                footer={null}
                open={open}
                onCancel={() => setOpen(false)}
                style={{ maxWidth: 350, marginTop: 230 }}
                className="z-20"
            >
                <div className="flex flex-col">
                    <h1 className="mt-[30px] mb-[5px]">Name</h1>
                    <input
                        type="text"
                        value={newWorkspace}
                        onChange={(e) => setNewWorkspace(e.target.value.slice(0, 25))}
                        className="border-[1px] border-[blue] rounded-[5px] p-2"
                        maxLength={25}
                    />
                    <button
                        onClick={handleCreateWorkspace}
                        disabled={isSubmitting}
                        className={`mt-[40px] bg-[#4C0BCD] text-[#FFFF] p-2 rounded-[5px] ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </Modal>

            {/* Modal for editing workspace */}
            <Modal
                title="Edit workspace"
                footer={null}
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                style={{ maxWidth: 350, marginTop: 230 }}
            >
                <div className='flex flex-col'>
                    <h1 className='mt-[30px] mb-[5px]'>Edit Name</h1>
                    <input
                        type="text"
                        value={editingWorkspace ? editingWorkspace.name : ''}
                        onChange={(e) => setEditingWorkspace({ ...editingWorkspace, name: e.target.value.slice(0, 25) })}
                        className='border-[1px] border-[blue] rounded-[5px] p-2'
                        maxLength={25}
                    />
                    <button
                        onClick={handleEdit}
                        disabled={isSubmitting}
                        className={`mt-[40px] bg-[#4C0BCD] text-[#FFFF] p-2 rounded-[5px] ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                        {isSubmitting ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </Modal>

            {/* Modal for confirming delete */}
            <Modal
                title="Confirm Delete"
                footer={null}
                open={deleteOpen}
                onCancel={() => setDeleteOpen(false)}
                style={{ maxWidth: 350, marginTop: 230 }}
            >
                <div className='flex flex-col'>
                    <h1 className='mt-[30px] mb-[5px]'>Are you sure you want to delete this workspace?</h1>
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
