import React,{useEffect,useState} from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage'
import CrudData from './CrudData';
import axios from 'axios';
import io from 'socket.io-client'
export const socket=io.connect("http://localhost:8000")
function App() {
  const [rowData,setRowData] = useState([]);
  useEffect(()=>{
    const getData=async()=>{
    const res= await axios.get("http://localhost:8000/grid/getGrid")
   
    setRowData(res.data.grid)
    }
    getData();
  },[])
  useEffect(()=>{
    const message=(data)=>{
     setRowData((prev)=>[...prev,data])
    }
    socket.on("add_chat", message);
   
    return () => {
        socket.off("add_chat", message);
    };
  },[setRowData])
  useEffect(()=>{
    const message=(data)=>{
const newData=[...rowData]

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
  },[rowData,setRowData])

  useEffect(() => {
    const message = (cur) => {
      const data = [...rowData];
      console.log(cur)
      const updatedData = data.filter((item) => item.uniqueId !== cur);
      setRowData(updatedData);
    };
    socket.on("delete_chat", message);
  
    return () => {
      socket.off("delete_chat", message);
    };
  }, [rowData,setRowData]);
  
  return (
    <BrowserRouter>
  <Routes>
  <Route path='/'element={<MainPage rowData={rowData} setRowData={setRowData}/>}/>
  <Route path='/cruddata'element={<CrudData rowData={rowData} setRowData={setRowData}/>}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App