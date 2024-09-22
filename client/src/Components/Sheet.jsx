import { Modal } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { TbSquareRoundedPlus } from "react-icons/tb";
import axiosInstance from '../axiosIn';
import { NavLink, useParams } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosTrash } from 'react-icons/io';
import { MdOutlineCreate } from "react-icons/md";


export default function Sheet({ data, workspace, fetchWorkspace }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingSheet, setEditingSheet] = useState(null);
    const [deleteSheet, setDeleteSheet] = useState(null);
    const [newSheet, setNewSheet] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittin, setIsSubmittin] = useState(false);
    const [loading, setLoading] = useState(false);
    const { sheet } = useParams();
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateSheet = async () => {
        if (newSheet.trim() === '') {
            alert('Please enter a valid Sheet name');
            return;
        }

        const newSheetData = { workspace: workspace, name: newSheet };

        try {
            setIsSubmitting(true);
            await axiosInstance.post('/sheet', newSheetData);
            setNewSheet('');
            setOpen(false);
            setIsSubmitting(false);
            fetchWorkspace();
        } catch (error) {
            console.error('Error creating Sheet:', error);
            setIsSubmitting(false);
            alert('Failed to create Sheet. Please try again.');
        }
    };

    const handleEdit = async () => {
        if (!editingSheet || editingSheet.name.trim() === '') {
            alert('Please enter a valid name');
            return;
        }

        try {
            setIsSubmitting(true);
            await axiosInstance.put(`/sheet/${editingSheet.id}`, { name: editingSheet.name });
            setEditOpen(false);
            setEditingSheet(null);
            setIsSubmitting(false);
            fetchWorkspace();
        } catch (error) {
            console.error('Error editing sheet:', error);
            setIsSubmitting(false);
            alert('Failed to update sheet. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmittin(true);
            await axiosInstance.delete(`/sheet/${deleteSheet}`);
            setDeleteOpen(false);
            setDeleteSheet(null);
            setIsSubmittin(false);
            fetchWorkspace();
        } catch (error) {
            console.error('Error deleting sheet:', error);
            alert('Failed to delete sheet. Please try again.');
        }
    };

    const openEditModal = (sheet) => {
        setEditingSheet({ id: sheet._id, name: sheet.name });
        setEditOpen(true);
    };

    const toggleMenu = (sheet) => {
        setActiveMenu(activeMenu === sheet ? null : sheet);
    };

    return (
        <>
            {loading && <p>Loading...</p>}
            <div className='mt-3 mb-[10px] flex justify-start items-center'>
                <div className='relative rounded-lg flex justify-center items-center p-[5px_12px] bg-[#170F28]'>
                    {data.map((sheet, idx) => (
                        <div key={idx} className='relative'>
                            <NavLink
                                to={`/home/${workspace}/${sheet._id}`}
                                className={({ isActive }) =>
                                    `text-[15px] rounded-lg p-[7px_8px] flex justify-center items-center gap-2 ${isActive ? "bg-[#0C0814]" : 'bg-[#170F28] text-[#FFFF]'}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        {sheet.name}
                                        <BsThreeDotsVertical
                                            className={`text-[15px] cursor-pointer ${isActive ? 'visible' : 'invisible'}`}
                                            onClick={() => toggleMenu(sheet)}
                                        />
                                        {activeMenu === sheet && (
                                            <div ref={menuRef} className="absolute right-0 top-full mt-1 border duration-300  bg-[#0C0814] shadow-lg text-[#FFFF] rounded-md z-20 w-25">
                                                <button
                                                    onClick={() => openEditModal(sheet)}
                                                    className="flex w-full px-2 py-1 text-left text-sm duration-300 hover:text-[red] rounded-md justify-start gap-1 items-center">
                                                    <MdOutlineCreate />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => { setDeleteSheet(sheet._id); setDeleteOpen(true); }}
                                                    className="flex w-full px-2 py-1 text-left text-sm duration-300 hover:text-[red] rounded-md justify-start gap-1 items-center">
                                                    <IoIosTrash />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </div>
                    ))}
                    <div className='text-[22px] p-[7px_10px] rounded-lg'>
                        <TbSquareRoundedPlus onClick={() => setOpen(true)} />
                    </div>
                </div>
            </div>
            <Modal
                title="Create Sheet"
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
                        value={newSheet}
                        onChange={(e) => setNewSheet(e.target.value.slice(0, 25))} // Limit input length
                        className="border-[1px] border-[blue] rounded-[5px] p-2"
                        maxLength={25} // Prevent entering more than 25 characters
                    />
                    <button
                        onClick={handleCreateSheet}
                        disabled={isSubmitting}
                        className={`mt-[40px] bg-[#4C0BCD] text-[#FFFF] p-2 rounded-[5px] ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </Modal>
            {/* Modal for editing Sheet */}
            <Modal
                title="Edit Sheet"
                footer={null}
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                style={{ maxWidth: 350, marginTop: 230 }}
            >
                <div className='flex flex-col'>
                    <h1 className='mt-[30px] mb-[5px]'>Edit Name</h1>
                    <input
                        type="text"
                        value={editingSheet ? editingSheet.name : ''}
                        onChange={(e) => setEditingSheet({ ...editingSheet, name: e.target.value.slice(0, 25) })} // Limit input length
                        className='border-[1px] border-[blue] rounded-[5px] p-2'
                        maxLength={25} // Prevent entering more than 25 characters
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
