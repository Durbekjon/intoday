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

  function getSheetById(sheetId) {
   const d = data ? data.sheets.find((data) => data._id === sheetId || sheet) : null
   console.log(d)
   return d;
  }
  const sheetFilter = getSheetById()
  console.log(getSheetById());

  if (!workspace) {
    return null;
  }

  return (
    <>
      <Header title={data?.name} workspace={workspace} />
      {data && <Sheet data={data?.sheets} workspace={workspace} fetchWorkspace={fetchWorkspace} getSheetById={getSheetById} />}
      {sheetFilter ? (<SheetDetails getSheetById={getSheetById} sheet={sheetFilter} />) : (<div className="flex justify-center items-center min-h-[70vh] flex-col ">
        <LuFileSpreadsheet className='text-[42px] mb-[10px]' />
        <h1>There isn't selected sheet </h1>
      </div>)}
    </>
  );
};

export default WorkspaceDetails;
