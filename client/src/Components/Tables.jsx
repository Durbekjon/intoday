import React from 'react'

export default function Tables() {
  const tableData = [
    {
      name: "03-05-24",
      editor: "",
      status: "Pending",
      upStatus: "Uploaded",
      time: "Jul 03 - Aug 20",
      price: 999,
    },
    {
      name: "07-07-24",
      editor: "",
      status: "Progress",
      upStatus: "Uploaded",
      time: "Jul 03 - Aug 20",
      price: 999,
    },
    {
      name: "09-10-24",
      editor: "",
      status: "Done",
      upStatus: "Uploaded",
      time: "Jul 03 - Aug 20",
      price: 999,
    },
    {
      name: "07-07-24",
      editor: "",
      status: "In Progress",
      upStatus: "Uploaded",
      time: "Jul 03 - Aug 20",
      price: 999,
    },
    {
      name: "09-10-24",
      editor: "",
      status: "Done",
      upStatus: "Uploaded",
      time: "Jul 03 - Aug 20",
      price: 999,
    }
  ]
  return (
    <>
      <table >
        <thead>
          <tr>
            <th className='p-[20px_26px]'><input className='w-[20px] h-[21px]' type="checkbox" /></th>
            <th className='p-[18px_69px]'>Name</th>
            <th className='p-[18px_72px]'>Editor</th>
            <th className='p-[18px_72px]'>Status</th>
            <th className='p-[16px_18px]'>Upload Status</th>
            <th className='p-[16px_43px]'>Deadline</th>
            <th className='p-[16px_48px]'>Price</th>
            <th className='p-[16px_57px]'>Paid</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {tableData.map((i, idx) => (
            <tr key={idx}>
              <td className='p-3'><input className='w-[20px] h-[21px]' type="checkbox" /></td>
              <td className='p-3'>{i.name}</td>
              <td className='p-3'>{i.editor}</td>
              <td className='p-3'>{i.status}</td>
              <td className='p-3'>{i.upStatus}</td>
              <td className='p-3'>{i.time}</td>
              <td className='p-3'>{i.price}</td>
              <td className='p-3'><input className='w-[20px] h-[21px]' type="checkbox" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
