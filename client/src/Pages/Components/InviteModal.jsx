import { Modal, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { BsPersonX } from 'react-icons/bs';
import { FaAngleDown } from 'react-icons/fa';
import { LuTrash } from 'react-icons/lu';
import axiosInstance from '../../axiosIn';

export default function InviteModal({ isModalOpen, handleOk, handleCancel }) {
    const [selectedOption, setSelectedOption] = useState({
        user: "",
        type: "viewer",
        workspaces: [],
        view: "all",
        permissions: []
    });
    const [user, setUser] = useState({ id: "", email: "" });
    const [email, setEmail] = useState("");
    const [data, setData] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [deleteMemberUser, setDeleteMemberUser] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Handle input change
    const handleChange = (field) => (value) => {
        setSelectedOption(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data: userData } = await axiosInstance.get(`/auth/${email}`);
            setUser(userData);
            const updatedOption = { ...selectedOption, user: userData._id };
            await axiosInstance.post(`/member`, updatedOption);
        } catch (error) {
            console.error('Error fetching workspace details:', error);
        }
    };

    const fetchWorkspaces = async () => {
        try {
            const res = await axiosInstance.get("/workspace");
            setWorkspaces(res.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);


    const fetchMembers = async () => {
        try {
            const res = await axiosInstance.get("/member");
            setData(res.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);


    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            await axiosInstance.put(`/member/cancel/${deleteMemberUser}`);
            setDeleteOpen(false);
            setDeleteMemberUser(null);
            setIsSubmitting(false);
            fetchMembers();
            handleSubmit();
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };
    const userFilter = data.filter((value) => value.status !== "cancelled" )
    return (
        <>
            <Modal
                footer={null}
                title={<span className="custom-modal-title">Invite people</span>}
                wrapClassName="custom-modal-wrapper"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                className='mt-[80px] min-w-[570px]'>
                <p>New members will gain access to this worklist.</p>
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-between items-center gap-3 mt-[20px]'>
                        <div className='border border-[#3c3c3c] rounded-lg p-[0px_5px] w-full flex justify-between items-center'>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="bg-transparent text-white p-2 border-none min-w-[250px] focus:outline-none"
                                placeholder="Invite member via email"
                                value={email}
                                required
                            />
                            <div className='flex justify-center items-center'>
                                <Space>
                                    <Select
                                        className="custom-select"
                                        onChange={handleChange('type')}
                                        value={selectedOption.type}
                                        options={[
                                            { value: 'viewer', label: 'Viewer' },
                                            { value: 'editor', label: 'Editor' },
                                            { value: 'admin', label: 'Admin' }
                                        ]}
                                        suffixIcon={<FaAngleDown />}
                                    />
                                </Space>
                            </div>
                        </div>
                        <button type='submit' className='p-[8px_18px] bg-white rounded-lg text-black font-[600]'>
                            Send
                        </button>
                    </div>

                    <div className='mt-4 min-w-[440px] flex'>
                        <Select
                            mode="tags"
                            className="custom-select w-full"
                            placeholder="Select permission"
                            onChange={handleChange('permissions')}
                            value={selectedOption.permissions}
                            options={[
                                { value: 'create', label: 'Create' },
                                { value: 'read', label: 'Read' },
                                { value: 'update', label: 'Update' },
                                { value: 'delete', label: 'Delete' }
                            ]}
                        />
                        <Select
                            className="custom-select w-[35%]"
                            placeholder="Select view"
                            onChange={handleChange('view')}
                            value={selectedOption.view}
                            options={[
                                { value: 'all', label: 'All' },
                                { value: 'own', label: 'Own' }
                            ]}
                        />
                    </div>

                    {/* Conditionally render "Select workspaces" with multiple selection */}
                    {selectedOption.view === 'own' && (
                        <Select
                            mode="multiple"  // This allows selecting multiple workspaces
                            className="custom-select w-full mt-3"
                            placeholder="Select workspaces"
                            onChange={handleChange('workspaces')}
                            value={selectedOption.workspaces}
                            options={workspaces.map(workspace => ({ value: workspace._id, label: workspace.name }))}
                        />
                    )}
                </form>
                <div className='mt-[25px] mb-[20px]'>
                    {data.length > 0 ? (
                        <div className="member-list max-h-[200px] overflow-y-auto">
                            {userFilter.map((option, i) => (
                                <div key={i} className='mb-3 flex justify-between items-center bg-[#170F28] p-[5px_10px] rounded-lg'>
                                    <div className='flex justify-center items-center gap-[10px]'>
                                        <img
                                            src="https://www.svgrepo.com/show/452030/avatar-default.svg"
                                            alt="User avatar"
                                            className='w-8 h-8 rounded-full'
                                        />
                                        <div>
                                            <h1 className='text-[15px]'>{option.user}</h1>
                                            <p className='text-[10px] text-[#a5a4a4]'>Pending Invitation</p>
                                        </div>
                                    </div>
                                    <LuTrash onClick={() => { setDeleteMemberUser(option._id); setDeleteOpen(true); }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col justify-center items-center mt-[40px]'>
                            <BsPersonX className='text-[35px] mb-[5px]' />
                            <h1 className='text-[15px]'>No invited members.</h1>
                        </div>
                    )}
                </div>
            
            </Modal>
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
                            disabled={isSubmitting}
                            className={`bg-red-600 text-white p-2 rounded-[5px] ${isSubmitting ? 'opacity-50' : ''}`}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
