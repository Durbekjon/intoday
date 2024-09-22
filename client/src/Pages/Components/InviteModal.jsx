import { Modal, Select, Space } from 'antd';
import React, { useState } from 'react';
import { BsPersonX } from 'react-icons/bs';
import { FaAngleDown } from 'react-icons/fa';
import { LuTrash } from 'react-icons/lu';
import axiosInstance from '../../axiosIn';

export default function InviteModal({ isModalOpen, handleOk, handleCancel, workspace,title }) {
    const [selectedOption, setSelectedOption] = useState({
        email: "",
        type: "viewer",
        workspaces: workspace,
        view: "all",
        permissions: []
    });
    // Handle email input change
    const handleEmailChange = (event) => {
        setSelectedOption({
            ...selectedOption,
            email: event.target.value
        });
    };

    // Handle role selection change
    const handleRoleChange = (value) => {
        setSelectedOption({
            ...selectedOption,
            type: value
        });
    };

    // Handle permissions selection change
    const handlePermissionsChange = (value) => {
        setSelectedOption({
            ...selectedOption,
            permissions: value
        });
    };

    // Handle view selection change
    const handleViewChange = (value) => {
        setSelectedOption({
            ...selectedOption,
            view: value
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log(selectedOption); // Log form data or send it to the server
        try {
            const res = await axiosInstance.get(`/workspace/${workspace}`);
            fetchWorkspace();
        } catch (error) {
            console.error('Error fetching workspace details:', error);
        }
    };

    const fetchWorkspace = async () => {
        try {
            const res = await axiosInstance.get(`/workspace/${workspace}`);
            setData(res.data);
        } catch (error) {
            console.error('Error fetching workspace details:', error);
        }
    };

    return (
        <>
            <Modal
                footer={null}
                wrapClassName="custom-modal-wrapper"
                title={<span className="custom-modal-title">Invite people</span>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                className='mt-[200px] min-w-[570px]'>

                <p>New members will gain access to this worklist.</p>

                {/* Form starts here */}
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-between items-center gap-3 mt-[20px]'>
                        <div className='border border-[#3c3c3c] rounded-lg p-[0px_5px] w-full flex justify-between items-center'>
                            <input
                                onChange={handleEmailChange}
                                type="email"
                                className="bg-transparent text-white p-2 border-none min-w-[250px] focus:outline-none"
                                placeholder="Invite member via email"
                                value={selectedOption.email}
                                required
                            />
                            <div className='flex justify-center items-center'>
                                <Space>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <Select
                                            className="custom-select"
                                            onChange={handleRoleChange}
                                            value={selectedOption.type}
                                            options={[
                                                { value: 'viewer', label: 'Viewer' },
                                                { value: 'editor', label: 'Editor' },
                                                { value: 'admin', label: 'Admin' }
                                            ]}
                                        />
                                        <FaAngleDown
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none',
                                            }}
                                        />
                                    </div>
                                </Space>
                            </div>
                        </div>
                        <button
                            type='submit'
                            className='p-[8px_18px] bg-white rounded-lg text-black font-[600]'>
                            Send
                        </button>
                    </div>

                    <div className='mt-4 min-w-[440px] flex'>
                        {/* Permissions Select */}
                        <Select
                            mode="tags"
                            className="custom-select w-full"
                            placeholder="Select permission"
                            onChange={handlePermissionsChange}
                            value={selectedOption.permissions}
                            options={[
                                { value: 'create', label: 'Create' },
                                { value: 'read', label: 'Read' },
                                { value: 'update', label: 'Update' },
                                { value: 'delete', label: 'Delete' }
                            ]}
                        />

                        {/* View Select */}
                        <Select
                            className="custom-select w-[35%]"
                            placeholder="Select view"
                            onChange={handleViewChange}
                            value={selectedOption.view}
                            options={[
                                { value: 'all', label: 'All' },
                                { value: 'own', label: 'Own' }
                            ]}
                        />
                    </div>
                        <Select
                            className="custom-select w-full"
                            placeholder="Select view"
                            onChange={handleViewChange}
                            value={selectedOption.view}
                            options={title}
                        />
                </form>
                {/* Form ends here */}

                <div className='flex justify-between items-center mt-[25px] bg-[#170F28] p-[5px_10px] rounded-lg'>
                    <div className='flex justify-center items-center gap-[10px]'>
                        <img
                            src="https://www.svgrepo.com/show/452030/avatar-default.svg"
                            alt="User avatar"
                            className='w-8 h-8 rounded-full'
                        />
                        <div>
                            <h1 className='text-[15px]'>uzbking466@gmail.com</h1>
                            <p className='text-[10px] text-[#a5a4a4]'>Pending Invitation</p>
                        </div>
                    </div>
                    <LuTrash />
                </div>

                <div className='flex flex-col justify-center items-center mt-[40px]'>
                    <BsPersonX className='text-[35px] mb-[5px]' />
                    <h1 className='text-[15px]'>No invited members.</h1>
                </div>
            </Modal>
        </>
    );
}
