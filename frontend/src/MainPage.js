import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import React, {  useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { socket } from './App';
const MainPage = ({rowData,setRowData}) => {
  const navigate=useNavigate();
  const [open, setOpen] = useState(false); 
  const [id,setId]=useState();
  const [colDefs] = useState([
    { field: 'name' },
    { field: 'email' },
    { field: 'age' },
    { field: 'role' },
    {field:"Edit",cellRenderer:({data})=>{
      return (<div><Button className='bg-blue-500' onClick={()=>{handleEdit(data)}}>
      Edit
    </Button></div>)
     }},
     {field:"Delete",cellRenderer:({data})=>{
      return (<div><Button className='bg-red-500' onClick={()=>{showModal(data.uniqueId);}}>
      Delete
    </Button></div>)
     }},
  ]);

  const handleOk =async () => {
      navigate('./cruddata',{state:{action:'Add New Data',edit:false}})
  };

  const handleEdit=(data)=>{
    navigate('./cruddata',{state:{action:'Edit Data',edit:true,data}})
  }

  const handleDelete = async (cur) => {
    setRowData((data)=>data.filter((item) => item.uniqueId !== cur));
    await axios.delete(`http://localhost:8000/grid/deleteGrid/${cur}`);
    await socket.emit("delete_chat", cur);
  };
  
 const showModal = (cur) => {
    setOpen(true);
    setId(cur)
  };

  const handleOkCancel = () => {
      setOpen(false);
      handleDelete(id);
  };

  const handleCancel = () => {
    setOpen(false);
  };
 

  
  
  return (
    <div>
       <Button className='bg-blue-500' onClick={()=>{handleOk();}}>
        Add Data
      </Button>
    <div className='h-screen ag-theme-quartz'>
    
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
  
    </div>
     <Modal
        open={open}
        title="Delete Field"
        onOk={handleOkCancel}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
           Cancel
          </Button>,
          <Button key="submit" className='bg-red-500'  onClick={handleOkCancel}>
           Delete
          </Button>
         
        ]}
      >
       Are you sure you want to delete this field ?
      </Modal>
    </div>
  );
};

export default MainPage;