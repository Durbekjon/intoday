import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosIn';

export default function Viewers() {
    // State to store fetched data
    const [viewersData, setViewersData] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state
    const [error, setError] = useState(null); // For error handling
    const [showAll, setShowAll] = useState(false); // For toggling between showing limited and all viewers

    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/member'); // Replace with your backend endpoint
            setViewersData(response.data); // Assuming the response contains an array of viewers
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Conditionally render based on loading, error, and fetched data
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Logic to determine the data to display
    const visibleData = showAll ? viewersData : viewersData.slice(0, 3);

    return (
        <div>
            {viewersData.length > 0 && (
                <div>
                    <div className='flex justify-between items-center mt-[65px] font-[400] text-[22px] leading-[26.4px]'>
                        <h1>Viewers</h1>
                        {!showAll && viewersData.length > 0 && (
                            <button
                                className='font-[400] text-[13px] leading-[15.6px] border-[1px] border-[#EFEBF6] rounded-[9px] p-[10px_19px]'
                                onClick={() => setShowAll(true)}
                            >
                                See all
                            </button>
                        )}
                    </div>
                    <div className='mt-[24px]'>
                        {visibleData.map((member, idx) => {
                            // Set default image and text if not provided by backend
                            const defaultImg = "https://www.svgrepo.com/show/452030/avatar-default.svg";
                            const defaultText = member.email || ""; // Show email if name is missing

                            return (
                                <div key={idx} className='mt-[7px] bg-[#170F28] flex justify-start items-center gap-[12px] p-[10px_19px] rounded-[9px]'>
                                    <img
                                        className='w-[21px] h-[22px] rounded-[50%]'
                                        src={member.img || defaultImg}
                                        alt="Viewer Avatar"
                                    />
                                    <h1 className='font-[400] text-[14px] leading-[16.8px]'>
                                        {member?.user?.email || defaultText}
                                    </h1>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
