import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { Button , Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { socket } from './App';
import { useDispatch,useSelector } from 'react-redux';
import { newGrid, removeGrid } from './app/gridSlice';
const MainPage = ({rowData,setRowData,totalPages,setTotalPages,totalItems,
setTotalItems,pageSize,setPageSize,setVal}) => {
  const navigate=useNavigate();
  const [open, setOpen] = useState(false); 
  const [id,setId]=useState();
  const dispatch=useDispatch()
  const grid = useSelector((state) => state.grid.grid);
  console.log(grid)
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
  useEffect(()=>{
  setTotalPages(Math.ceil(totalItems/2))
  },[setTotalPages,totalItems])

  const handleOk =async () => {

      navigate('./cruddata',{state:{action:'Add New Data',edit:false}})
  };

  const handleEdit=(data)=>{
    setVal(data)
    navigate('./cruddata',{state:{action:'Edit Data',edit:true}})
  }

  const handleDelete = async (cur) => {
    setTotalItems(prev=>prev-1);
    setRowData((data)=>data.filter((item) => item.uniqueId !== cur));
    dispatch(removeGrid(cur))
    await axios.delete(`http://localhost:8000/grid/deleteGrid/${cur}`)
    await socket.emit("delete_chat",cur, pageSize);
    fetchData(pageSize)
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
 
  

 
  const fetchData = async (page) => {
    try {
      if((page<1||page>totalPages))
      return;
    // if(page*2<=allData?.length&&arr.length!==0){
      
    //   if(page!==totalPages){
    //   setRowData(arr.slice((page-1)*2,page*2))
    //   setPageSize(page)
    //   return;}
    //   page=page-1
    // }

    //   if(page*2<=grid?.length){
    //   setRowData(grid.slice((page-1)*2,page*2))
    //   setPageSize(page)
    //   return;
    // }

      const response = await axios.get(`http://localhost:8000/grid/getGrid?page=${page}&pageSize=${2}`);
      if(response?.data?.data?.length===0)
      fetchData(page-1)
      setRowData(response.data.data);
       dispatch(newGrid(response.data.data))
      setPageSize(response.data.page.currentPage)
      setTotalPages(response.data.page.totalPages)
      setTotalItems(response.data.page.totalItems)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  
  return (
    <div>
       <Button className='bg-blue-500' onClick={()=>{handleOk();}}>
        Add Data
      </Button>
    <div className='h-48 ag-theme-quartz'>
    
    <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
         
         
        />
         <div style={{ marginTop: '10px' }}>
         <Button className='bg-green-500' onClick={() => fetchData(pageSize-1)}>
            Prev Page
          </Button>
          <span style={{ marginLeft: '10px' }}>
            Page {pageSize} of {totalPages}
          </span>
          <Button className='bg-green-500' onClick={() => fetchData(pageSize+1)}>
            Next Page
          </Button>
          <span style={{ marginLeft: '10px' }}>
           Total Items : {totalItems}
          </span>
        </div>
    
  
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