import React,{useState,useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { socket } from './App';
import { useDispatch } from 'react-redux';
import { addGrid, editGrid } from './app/gridSlice';
import {  toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CrudData = ({rowData,setRowData,setTotalItems,pageSize,val,iid,setIid}) => {
 
    const location = useLocation();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [field,setField]=useState(false);
    const {action,edit}=location?.state
    const id=val?.uniqueId;
    const uniqueId = uuidv4();
    const [value,setValue]=useState({
        name:'',
        email:'',
        age:'',
        role:'',
        degree:''
      })
     
      useEffect(()=>{
        if(id===iid&&iid!==''){
          setIid('')
          toast.error("This data has been deleted", {
            autoClose: 2000,
            onClose: () => {
                navigate('/');
            }
        });
  
      }
        if(val&&action==='Edit Data')
        setValue(val)
      else
      setValue({
        name:'',
        email:'',
        age:'',
        role:'',
        degree:''
      })
      },[val,action,id,iid,setIid,navigate])
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleOk=async()=>{
        if(value.name===''||value.email===''||value.age===''||value.role===''){
          setField(true);
          return;
        }
        setField(false);
        if(pageSize===1){
        const data=[{...value,uniqueId},...rowData].slice(0,2);
      setRowData(data)}
      dispatch(addGrid({...value,uniqueId}))
      await axios.post("http://localhost:8000/grid/addGrid",{...value,uniqueId})
      await socket.emit("add_chat",{...value,uniqueId},pageSize)
      setValue({name:'',email:'',age:'',role:'',degree:''})
      setTotalItems(prev=>prev+1);
      navigate('/')
      }
      
      const handleEditOk=async()=>{
        const data = [...rowData]; 
        await socket.emit("edit_chat",value)
         const index = data.findIndex((a) => a.uniqueId === id); 
         if (index >= 0) {
           data[index] = { ...data[index], ...value };
         }
         setRowData(data);
         dispatch(editGrid(value))
        await axios.patch(`http://localhost:8000/grid/updateGrid/${id}`,{...value})
        setValue({name:'',email:'',age:'',role:'',degree:''})
        navigate('/')
         }
       

      
    
  return (
    <div>
              <ToastContainer className='w-10 h-10'/>

        <fieldset className='border border-black w-[50%] mx-auto px-10 mt-10 rounded-3xl'>
        <div className='text-2xl bold text-center'>{action}</div>
        <input name='name' placeholder='Enter Name' value={value.name} onChange={handleChange}
        className='border border-black my-4 h-10 w-full rounded-lg '/><br/>
        <input name='email' placeholder='Enter Email' value={value.email} onChange={handleChange}
         className='border border-black mb-4 h-10 w-full rounded-lg'/><br/>
        <input name='age' placeholder='Enter age' value={value.age} onChange={handleChange}
        className='border border-black mb-4 h-10 w-full rounded-lg'/><br/>
        <input name='role' placeholder='Enter Role' value={value.role} onChange={handleChange}
        className='border border-black mb-4 h-10 w-full rounded-lg'/>
         <input name='degree' placeholder='Enter Degree' value={value.degree} onChange={handleChange}
        className='border border-black mb-4 h-10 w-full rounded-lg'/>
        <div className='pb-2 text-red-600'>{field?'All field are required':''}</div>
        <div className='mb-2'>  
            <button className='border border-black w-16 p-1 mr-2 rounded-lg'
            ><Link to='/'>Cancel</Link></button>
            <button className='border border-black w-24 p-1 rounded-lg'
            onClick={edit?()=>handleEditOk():()=>handleOk()}>{edit?'Save':'Add Data'}</button>
        </div>
        </fieldset>
    </div>
  )
}

export default CrudData;

