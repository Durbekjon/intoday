import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosIn';
import Sheet from './Sheet';
import Header from '../Pages/Header';
import SheetDetails from './SheetDetails';
import { LuFileSpreadsheet } from 'react-icons/lu';

const WorkspaceDetails = () => {
  const { workspace, sheet } = useParams();
  const [data, setData] = useState()
  
  const fetchWorkspace = async () => {
    try {
      const res = await axiosInstance.get(`/workspace/${workspace}`);
      setData(res.data)
    } catch (error) {
      console.error('Error fetching workspace details:', error);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [workspace]);

  const sheetFilter = data ? data.sheets.find((data) => data._id === sheet) : null;

  if (!workspace) {
    return null;
  }

  return (
    <>
      <Header title={data?.name} workspace={workspace}/>
      {data && <Sheet data={data?.sheets} workspace={workspace} fetchWorkspace={fetchWorkspace} />}
      {sheetFilter ? (<SheetDetails sheet={sheetFilter} />) : (<div className="flex justify-center items-center h-[90vh] flex-col ">
        <LuFileSpreadsheet className='text-[42px] mb-[10px]' />
        <h1>There isn't selected sheet </h1>
      </div>)}
    </>
  );
};

export default WorkspaceDetails;
