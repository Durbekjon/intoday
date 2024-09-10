import React, { useState, useEffect } from 'react';
import { BsPlusCircle, BsThreeDotsVertical } from 'react-icons/bs';
import axiosInstance from '../axiosIn';
import { Modal } from 'antd';
import Link from 'antd/es/typography/Link';
import { NavLink } from "react-router-dom";

export default function Workspace() {
    const [open, setOpen] = useState(false); // To control modal for creating new workspace
    const [editOpen, setEditOpen] = useState(false); // To control modal for editing
    const [deleteOpen, setDeleteOpen] = useState(false); // To control modal for deleting
    const [loading, setLoading] = useState(false); // To show loading state
    const [data, setData] = useState(null); // To hold workspace data
    const [newWorkspace, setNewWorkspace] = useState(''); // To track input value for new workspace
    const [editingWorkspace, setEditingWorkspace] = useState(null); // To track which workspace is being edited
    const [deleteWorkspaceId, setDeleteWorkspaceId] = useState(null); // To track which workspace is being deleted
    const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission state
    const [isSubmittin, setIsSubmittin] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null); // To handle which dropdown menu is open

    // Fetch data when the component mounts
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

    // Function to handle "Create" button click in modal
    const handleCreateWorkspace = async () => {
        if (newWorkspace.trim() === '') {
            alert('Please enter a valid workspace name');
            return;
        }

        const newWorkspaceData = {
            name: newWorkspace,
        };

        try {
            setIsSubmitting(true);
            setIsSubmittin(true);
            const res = await axiosInstance.post('/workspace', newWorkspaceData);
            setData([...data, res.data]);
            setNewWorkspace('');
            setOpen(false);
            setIsSubmitting(false);
            setIsSubmittin(false)
        } catch (error) {
            console.error('Error creating workspace:', error);
            setIsSubmitting(false);
            alert('Failed to create workspace. Please try again.');
        }
    };

    // Function to handle editing a workspace
    const handleEdit = async () => {
        if (!editingWorkspace || editingWorkspace.name.trim() === '') {
            alert('Please enter a valid name');
            return;
        }
        try {
            setIsSubmitting(true);
            const res = await axiosInstance.put(`/workspace/` + editingWorkspace.id, { name: editingWorkspace.name });
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
    // Function to handle deleting a workspace
    const handleDelete = async () => {

        try {
            setIsSubmittin(true);
            await axiosInstance.delete(`/workspace/` + deleteWorkspaceId);
            setDeleteOpen(false);
            setDeleteWorkspaceId(null);
            setIsSubmittin(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting workspace:', error);
            alert('Failed to delete workspace. Please try again.');
        }
    };

    // Open the edit modal and set the workspace to edit
    const openEditModal = (workspace) => {
        setEditingWorkspace({ id: workspace._id, name: workspace.name });
        setEditOpen(true);
    };



    return (
        <>
            <h1 className='mt-[27px] mb-[16px] text-[22px] font-[400] leading-[26.4px]'>Workspace</h1>

            {loading && <p>Loading...</p>}

            {data && data.map((workspace, idx) => (
                <NavLink
                    key={idx}
                    to={"/home/" + workspace._id}
                    className={({ isActive }) => isActive ? "bg-[#EFEBF6] text-[#0C0814] relative flex gap-[20px] p-[10px_21px] justify-between items-center rounded-[--CornerSmall] text-[22px] font-[400] leading-[26.4px] mt-[10px] duration-300" : 'duration-300 bg-[#170F28] relative flex gap-[20px] p-[10px_21px] justify-between items-center rounded-[--CornerSmall] text-[22px] font-[400] leading-[26.4px] mt-[10px]'}>
                    <div className='flex gap-[20px]'>
                        <h1>#</h1>
                        <h2>{workspace.name}</h2>
                    </div>
                    <BsThreeDotsVertical
                        className='text-[20px] cursor-pointer'
                        onClick={() => setActiveMenu(activeMenu === workspace ? null : workspace)}
                    />
                    {activeMenu === workspace && (
                        <div className="absolute right-0 top-full bg-[#EFEBF6] shadow-lg text-[#0C0814] rounded-md z-10">
                            <button
                                onClick={() => openEditModal(workspace)}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 rounded-md ">
                                Edit
                            </button>
                            <button
                                onClick={() => { setDeleteWorkspaceId(workspace._id); setDeleteOpen(true); }}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 rounded-md ">
                                Delete
                            </button>
                        </div>
                    )}
                </NavLink>
            ))}


            {/* Button to open modal for new workspace */}
            <button onClick={() => setOpen(true)} className='w-full flex justify-between items-center bg-[#EFEBF6] text-[#0C0814] p-[10px_19px] rounded-[9px] mt-[16px] min-h-[48px]'>
                <div className='flex justify-center items-center gap-[14px]'>
                    <BsPlusCircle className='text-[22px]' />
                    <h1 className='font-[400] text-[18px] leading-[21.6px]'>Add worklist</h1>
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
                        onChange={(e) => setNewWorkspace(e.target.value)}
                        className="border-[1px] border-[blue] rounded-[5px] p-2"
                    />
                    <button
                        onClick={handleCreateWorkspace}
                        disabled={isSubmitting}
                        className={`mt-[40px] bg-[#4C0BCD] text-[#FFFF] p-2 rounded-[5px] ${isSubmitting ? 'opacity-50' : ''
                            }`}
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
                style={{ maxWidth: 350, marginTop: 230 }}>
                <div className='flex flex-col'>
                    <h1 className='mt-[30px] mb-[5px]'>Edit Name</h1>
                    <input
                        type="text"
                        value={editingWorkspace ? editingWorkspace.name : ''}
                        onChange={(e) => setEditingWorkspace({ ...editingWorkspace, name: e.target.value })}
                        className='border-[1px] border-[blue] rounded-[5px] p-2'
                    />
                    <button
                        onClick={handleEdit}
                        disabled={isSubmitting}
                        className={`mt-[40px] bg-[#4C0BCD] text-[#FFFF] p-2 rounded-[5px] ${isSubmitting ? 'opacity-50' : ''}`}>
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
                style={{ maxWidth: 350, marginTop: 230 }}>
                <div className='flex flex-col'>
                    <h1 className='mt-[30px] mb-[5px]'>Are you sure you want to delete this workspace?</h1>
                    <div className='flex gap-4'>
                        <button
                            onClick={() => setDeleteOpen(false)}
                            className='bg-gray-500 text-white p-2 rounded-[5px]'>
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmittin}
                            className={`bg-red-600 text-white p-2 rounded-[5px] ${isSubmittin ? 'opacity-50' : ''}`}>
                            {isSubmittin ? 'Delete...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
