import React,{useState,useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { socket } from './App';
const CrudData = ({rowData,setRowData}) => {
    const location = useLocation();
    const navigate=useNavigate();
    const [field,setField]=useState(false);
    const {action,edit,data}=location?.state
    const id=data?.uniqueId;
    const uniqueId = uuidv4();
    const [value,setValue]=useState({
        name:'',
        email:'',
        age:'',
        role:''
      })

      useEffect(()=>{
        if(data)
        setValue(data)
      },[data])
   
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
        const data=[...rowData,{...value,uniqueId}];
      setRowData(data)
      await axios.post("http://localhost:8000/grid/addGrid",{...value,uniqueId})
      await socket.emit("add_chat",{...value,uniqueId})
      setValue({name:'',email:'',age:'',role:''})
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
        await axios.patch(`http://localhost:8000/grid/updateGrid/${id}`,{...value})
        setValue({name:'',email:'',age:'',role:''})
        navigate('/')
         }
       

      
    
  return (
    <div>
        
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

export default CrudData