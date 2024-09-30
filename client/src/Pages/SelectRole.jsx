import React from 'react'
import useUserFatch from '../Hooks/useUserFatch';
import Header from './Header';

export default function SelectRole() {
  const { user, userLoading, userError } = useUserFatch();
  return (
    <>
      <Header title='SelectRole'/>
      <div>SelectRole</div>
    </>
  )
}

