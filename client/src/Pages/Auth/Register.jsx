import React from 'react';
import { Button, Form, Input } from 'antd';
import axiosInstance from '../../axiosIn';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await axiosInstance.post("/auth/register", values);
            if (res.data) {
                localStorage.setItem('token', res.data.token);
                navigate('/home');
            }
            console.log('Success:', values);
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div className='reg w-full min-h-[100vh] flex justify-center items-center'>
                <div className='border-[1px] border-[#EFEBF6] max-w-[758px] min-h-[510px] rounded-[--CornerSmall] p-[51px_62px] bg-transparent '>
                    <div className='flex justify-between items-center '>
                    </div>
                    <h1 className='mb-[45.5px] text-[36px] font-[700] leading-[43.2px] text-[#FFF]'>Create your acount</h1>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        layout="vertical"
                        style={{
                            maxWidth: 600,
                            color: "#FFFFFF",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={<span style={{
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: "21px",
                                lineHeight: "25px",
                            }}>Email</span>}
                            name="email"
                            style={{ marginBottom: '24px' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: 'black',
                                    fontWeight: '700',
                                    fontSize: "21px",
                                    lineHeight: "25px",
                                    borderRadius: '4px',
                                    padding: '16px',
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<span style={{
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: "21px",
                                lineHeight: "25px",
                            }}>Password</span>}
                            name="password"
                            style={{ marginBottom: '24px' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: 'black',
                                    fontWeight: '700',
                                    fontSize: "21px",
                                    lineHeight: "25px",
                                    borderRadius: '4px',
                                    padding: '16px',
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className='mt-[40px] min-w-[600px] min-h-[86px] p-[30px_36px] rounded-[--CornerSmall] bg-[#4C0BCD] text-[21px] font-[700] leading-[25.2px] text-[#EFEBF6]'
                                style={{
                                    backgroundColor: '#4C0BCD',
                                    borderColor: '#4C0BCD',
                                    borderRadius: '4px',
                                    fontSize: '21px',
                                    fontWeight: '700',
                                    color: '#EFEBF6',
                                }}
                            >
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Register;
