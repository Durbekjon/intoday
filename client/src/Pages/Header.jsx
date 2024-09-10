import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { FiUserPlus } from 'react-icons/fi'
import { HiOutlineBell } from 'react-icons/hi'

export default function Header({ title = "Weddings" }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  return (
    <>
      <div className='border-b-[1px] border-b-[#1F1E1E] min-h-[102px] ml-[18px] mr-[26px] flex justify-between items-center'>
        <div className='flex justify-start items-center'>
          <h1 className='font-[700] text-[22px] leading-[26.4px] text-[#8469B9] ml-[40px]'>
            {title} {/* Workspace name or "Weddings" as default */}
          </h1>
        </div>
        <div className='flex gap-[9px]'>
          <div className='border-[1px] border-[#EFEBF6] rounded-[--CornerSmall] p-[12px] flex justify-center items-center max-h-[58px]'>
            <HiOutlineBell className='text-[32px]' />
          </div>
          <div className='border-[1px] border-[#EFEBF6] rounded-[--CornerSmall] flex gap-[17px] p-[12px_14px] justify-center items-center max-h-[58px]'>
            <FiUserPlus className='text-[28px]' />
            <p className='text-[18px] font-[400] leading-[21px]'>Invite</p>
          </div>
          <div className='relative'>
            <div
              onClick={toggleProfileMenu}
              className='cursor-pointer border-[1px] border-[#EFEBF6] rounded-[--CornerSmall] flex justify-between items-center p-[14px_16px] max-h-[62px] gap-[23px]'>
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
                alt="Profile" />
              <FaChevronDown className='text-[16px]' />
            </div>
            {showProfileMenu && (
              <div className='absolute right-0 mt-2 w-[200px] text-[#EFEBF6] border border-[#EFEBF6] rounded-[--CornerSmall] shadow-lg z-50'>
                <a href="#" className='block px-4 py-2 text-[#EFEBF6] hover:text-black hover:bg-[#EFEBF6]'>Profile</a>
                <a href="#" className='block px-4 py-2 text-[#EFEBF6] hover:text-black hover:bg-[#EFEBF6]'>Settings</a>
                <a href="#" className='block px-4 py-2 text-[#EFEBF6] hover:text-black hover:bg-[#EFEBF6]'>Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
