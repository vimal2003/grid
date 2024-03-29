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
setTotalItems,pageSize,setPageSize,setVal,numberOfRows}) => {
  const navigate=useNavigate();
  const [open, setOpen] = useState(false); 
  const [id,setId]=useState();
  const dispatch=useDispatch()
  const grid = useSelector((state) => state.grid.grid);
  console.log(grid,'3')
  const [colDefs] = useState([
    { field: 'name' },
    { field: 'email' },
    { field: 'age' },
    {field:'degree'},
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
  setTotalPages(Math.ceil(totalItems/numberOfRows))
  },[setTotalPages,totalItems,numberOfRows])

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
    getData(pageSize)
    
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
 const getData=(val)=>{
     fetchData(val)
   
 }
  

  const fetchData = async (page) => {
    try {
      if((page<1||page>totalPages))
      return;

    //   if(page*2<=grid?.length||grid.slice((page-1)*2,page*2).length!==0){
    //   setRowData(grid.slice((page-1)*2,page*2))
    //   setPageSize(page)
    //   return;
    // }

      const response = await axios.get(`http://localhost:8000/grid/getGrid?page=${page}&pageSize=${numberOfRows}`);
      if(response?.data?.data1?.length===0)
      getData(page-1)
      let data = response.data.data1;
      dispatch(newGrid(data))
      setRowData(data);
      console.log(grid)
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
    <div className='ag-theme-quartz'>
    
    <AgGridReact 
          rowData={rowData}
          columnDefs={colDefs}
          domLayout='autoHeight'
         
        />
         <div style={{ marginTop: '10px' }}>
         <Button className='bg-green-500' onClick={() => getData(pageSize-1)}>
            Prev Page
          </Button>
          <span style={{ marginLeft: '10px' }}>
            Page {pageSize} of {totalPages}
          </span>
          <Button className='bg-green-500' onClick={() => getData(pageSize+1)}>
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





