import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosIn';


export default function CreateCompany() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await axiosInstance.post("/company", values);
            if (res.data) {
                localStorage.setItem('token', res.data.token);
                navigate('/home');
            }
            console.log('Success:', values);
        } catch (error) {
            console.error("Error during register:", error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            <div
                onFinish={onFinish}
                onFinishFailed={onFinishFailed} className='reg w-full min-h-[100vh] flex justify-center items-center'>
                <div className='border-[1px] border-[#EFEBF6] max-w-[758px] min-h-[510px] rounded-[--CornerSmall] p-[51px_62px]'>
                    <h3 className='text-[21px] font-[700] leading-[25.2px]'>You don’t have  a company yet!</h3>
                    <h1 className='mt-[45.5px] mb-[45.5px] text-[36px] font-[700] leading-[43.2px]'>Create your company</h1>
                    <h4 className='text-[21px] font-[700] leading-[25.2px]'>Type company name</h4>
                    <input

                        type="text"
                        placeholder='Company name...'
                        className='text-[black] mt-[11px] mb-[41px] p-[30px_36px] min-w-[633px] min-h-[86px] rounded-[--CornerSmall] text-[21px] font-[700] leading-[25.2px]' />
                    <button className='min-w-[633px] min-h-[86px] p-[30px_36px] rounded-[--CornerSmall] bg-[#4C0BCD] text-[21px] font-[700] leading-[25.2px] text-[#EFEBF6] mb-[10px]'>Create</button>
                    <Link to={"/"} className='text-[21px] font-[700] leading-[25.2px] '>Already have a acount?</Link>
                </div>
            </div>
        </>
    )
}
