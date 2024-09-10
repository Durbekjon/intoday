import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosIn';

const WorkspaceDetails = () => {
  const { id } = useParams();  // Get the workspace ID from the URL
  const [workspace, setWorkspace] = useState(null);

  const fetchWorkspace = async () => {
    try {
      const res = await axiosInstance.get(`/workspace/${id}`);
      setWorkspace(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching workspace details:', error);
    }
  };
  useEffect(() => {
    // Fetch the workspace details when the component mounts

    fetchWorkspace();
  }, [id]);

  if (!workspace) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{workspace.name}</h1>
      <p>{workspace.description || 'No description available'}</p>
    </div>
  );
};

export default WorkspaceDetails;
