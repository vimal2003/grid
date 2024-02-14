import React,{useEffect,useState} from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage'
import CrudData from './CrudData';
import axios from 'axios';
import io from 'socket.io-client'
import { useDispatch } from 'react-redux';
import { addGrid, editGrid, newGrid, removeGrid } from './app/gridSlice';
export const socket=io.connect("http://localhost:8000")
function App() {
  const [rowData,setRowData] = useState([]);
  const [totalPages,setTotalPages]=useState(0);
  const [totalItems,setTotalItems]=useState(0);
  const [pageSize,setPageSize]=useState(0);
  const [val,setVal]=useState();
  const [id,setId]=useState('');
  const dispatch=useDispatch();
  const numberOfRows=2;
  useEffect(()=>{
    const getData=async()=>{
      const response = await axios.get(`http://localhost:8000/grid/getGrid?page=${1}&pageSize=${numberOfRows}`);
      let data = response.data.data1;
      
      setRowData(data);
      dispatch(newGrid(data))
      setPageSize(data?.length!==0?1:0);
      setTotalPages(response?.data?.page?.totalPages)
      setTotalItems(response?.data?.page?.totalItems)
    }
    getData();
  },[dispatch])
  useEffect(()=>{
    const message=(data,page)=>{
      dispatch(addGrid(data))
      if(page===1)
     setRowData((prev)=>[data,...prev].slice(0,numberOfRows))
     setTotalItems(prev=>prev+1)
    }
    socket.on("add_chat", message);
   
    return () => {
        socket.off("add_chat", message);
    };
  },[setRowData,pageSize,dispatch])
  useEffect(()=>{
    const message=(data)=>{
dispatch(editGrid(data))
const newData=[...rowData]
  setVal(data)
  const index = newData.findIndex((a) => a.uniqueId === data.uniqueId); 
  if (index >= 0) {
    newData[index] = { ...newData[index], ...data };
  }
  setRowData(newData);
 
    }
    socket.on("edit_chat", message);
   
    return () => {
        socket.off("edit_chat", message);
    };
  },[rowData,setRowData,dispatch])

  useEffect(() => {
    const message = (cur,page) => {
      dispatch(removeGrid(cur));
      setId(cur)
      setTotalItems(prev=>prev-1);
    const fetchData=async(count)=>{
      setTotalPages(prev=>prev-1)
      if(count<1||count>totalPages)
      return;
     
      const response = await axios.get(`http://localhost:8000/grid/getGrid?page=${count}&pageSize=${numberOfRows}`);
      if(response?.data?.data1?.length===0)
      fetchData(count-1)
      let data = response.data.data1
      setRowData(data);
      setPageSize(response.data.page.currentPage)
      setTotalPages(response.data.page.totalPages)
      setTotalItems(response.data.page.totalItems)
    }
    fetchData(page);
    
    };
    socket.on("delete_chat", message);
  
    return () => {
      socket.off("delete_chat", message);
    };
  }, [rowData,setRowData,pageSize,totalPages,dispatch]);
  
  return (
    <BrowserRouter>
  <Routes>

  <Route path='/'element={<MainPage rowData={rowData} setRowData={setRowData}
  totalPages={totalPages} setTotalPages={setTotalPages} totalItems={totalItems}
  setTotalItems={setTotalItems} pageSize={pageSize} setPageSize={setPageSize} 
  setVal={setVal} numberOfRows={numberOfRows}/>}/>

  <Route path='/cruddata'element={<CrudData rowData={rowData} setRowData={setRowData}
  setTotalItems={setTotalItems} pageSize={pageSize} val={val}
 iid={id} setIid={setId} numberOfRows={numberOfRows}/>}/>

  </Routes>
  </BrowserRouter>
  )
}

export default App
