import { Button, Dropdown, Modal, Select, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { BsPersonX } from 'react-icons/bs';
import { FaAngleDown, FaChevronDown } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { HiOutlineBell } from 'react-icons/hi';
import { LuTrash, LuBellOff } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import InviteModal from './Components/InviteModal';

export default function Header({ title = "Weddings", workspace }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className='w-full min-h-[102px]'>
        <div className='top-0 min-h-[102px] border-b-[1px] bg-[#0C0814] border-b-[#1F1E1E] flex justify-between items-center'>
          <div className='flex justify-start items-center'>
            <h1 className='font-[700] text-[22px] leading-[26.4px] text-[#8469B9] ml-[40px]'>
              {title}
            </h1>
          </div>
          <div className='flex gap-[9px]'>
            <Dropdown
              className="flex justify-center items-center bg-[#0c0814]"
              trigger={['click']}
              overlay={
                <div className="p-3 bg-[#0c0814] border border-[#FFFF] rounded-lg flex flex-col justify-center items-center">
                  <LuBellOff className="text-[24px] text-[#FFFF] mb-2" />
                  <p className="text-[#FFFF] font-semibold text-[11px]">No notification</p>
                </div>
              }
              placement="bottomCenter"
            >
              <Space className="bg-[#0c0814]">
                <div className="border-[1px] border-[#EFEBF6] rounded-[--CornerSmall] p-[12px] flex justify-center items-center max-h-[58px]">
                  <HiOutlineBell className="text-[32px]" />
                </div>
              </Space>
            </Dropdown>
            <Button
              onClick={showModal}
              style={{
                border: '1px solid #EFEBF6',
                backgroundColor: '#0C0814',
                color: '#FFFF',
                borderRadius: 'var(--CornerSmall)',
                display: 'flex',
                gap: '17px',
                padding: '12px 14px',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '58px',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: '21px',
              }}
              icon={<FiUserPlus style={{ fontSize: '28px' }} />}
            >
              Invite
            </Button>
            <div className='relative' ref={profileMenuRef}>
              <div
                onClick={toggleProfileMenu}
                className='cursor-pointer border-[1px] border-[#EFEBF6] rounded-[--CornerSmall] flex justify-between items-center p-[14px_16px] max-h-[62px] gap-[23px]'
              >
                <div>
                  <h1 className='font-[400] text-[18px] leading-[21px] text-[#EFEBF6]'>Baxrom Sidikov</h1>
                  <div className='flex justify-start items-center gap-[6px]'>
                    <p className='text-[11px] font-[400] leading-[13.2px] text-[#007AFF]'>Codevision</p>
                    <p className='text-[8px] font-[400] leading-[9.6px]'>premium+</p>
                  </div>
                </div>
                <img
                  className='w-[41px] h-[41px] rounded-full object-cover'
                  src="https://s3-alpha-sig.figma.com/img/b9bd/fa3e/5d3c4f61d58fc049b8def14e6d66662b?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iAnjUwiVLk7JKwJIQ6W8agBqBvqsajRqdcWL6U-JIz7TyZ6vYtVvI6e~J-yUMz4mxPzgYRy7QVh~-fZhbu65HMWoC1c8ASQPPkj-RjzHs5wtEYeiku6sInwdlxJMcVW4VRzBMNfFONTxjTHxxemdFUB4qBlwyO4ECVPLWz6Q6fxgr2x92ukoL7hQ~1A2C6tA8lK~XZ4AFONOCLDShCu5U0o9a2YwWJeMJIJYcJyblYje10bb1oA2Ysqp~K9Aee7KBXnomieMCuJhy0x~Xry6O1HubjrFmfghLmEQOcwGaiodbdNqAfk1n7GrsWVyLfh4L3EWyNaW5lC23vVBJcR8bw__"
                  alt="Profile"
                />
                <FaChevronDown className='text-[16px]' />
              </div>
              {showProfileMenu && (
                <div className=' absolute right-0 mt-2 w-[200px] text-[#EFEBF6] border border-[#EFEBF6] rounded-[--CornerSmall] shadow-lg z-50 p-2'>
                  <Link to={"/home/profile"} className='block px-4 py-2 text-[#EFEBF6] rounded-lg hover:bg-[#170F28] duration-300'>Profile</Link>
                  <Link to={"/home/settings"} className='block px-4 py-2 text-[#EFEBF6] rounded-lg hover:bg-[#170F28] duration-300'>Settings</Link>
                  <div className='block px-4 py-2 text-[#EFEBF6] rounded-lg hover:bg-[#ff3e3e]  duration-300'>Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <InviteModal title={title} isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} handleChange={handleChange} workspace={workspace}/>
    </>
  );
}
