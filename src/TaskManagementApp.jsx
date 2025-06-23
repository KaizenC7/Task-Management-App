import React , { useState } from 'react'

export default function TaskManagementApp() {

    const [Title, setTitle] = useState("");
    const [Desc, setDesc] = useState("");
    const [NewTask, setNewTask] = useState([]);

    const [EditIndex, setEditIndex] = useState(null)
    const [EditTitle, setEditTitle] = useState("")
    const [EditDesc, setEditDesc] = useState("")


    function addTask(){
        setNewTask([...NewTask, {Title, Desc, completed: false}]);
        console.log(NewTask);
        setTitle("");
        setDesc("");
    }

    function deleteTask(index){
      let deletedTasks = NewTask.filter((_, i) => i !== index)
      setNewTask(deletedTasks);
    }

    function completedTask(index){
      const completedTasks = NewTask.map((task, i) => {
        if(i === index){
          return {...task, completed:!task.completed}
        }
        return task
      })
      setNewTask(completedTasks)
    };

    function editTask(index, task){
      setEditIndex(index)
      setEditTitle(task.Title)
      setEditDesc(task.Desc)
    };

    function saveTask(){
      const updatedTasks = NewTask.map((task, i) =>{
        if(i === EditIndex){
          return {...task, Title: EditTitle, Desc: EditDesc}
        }
        return task
      })
      setNewTask(updatedTasks)
      setEditIndex(null)
      setEditTitle("")
      setEditDesc("")
    }
      

  return (
    <div className='TaskBody'>
        <h1>Task Management App</h1>
        <div className='Inputs'>

            <input className='Title' placeholder="Enter Task's Title" type='text' 
            value={Title} onChange={(event) =>{
            setTitle(event.target.value);
            }}>
            </input>

            <input className='Desc' placeholder="Enter Task's Description" type='text' 
            value={Desc} onChange={(event) =>{
            setDesc(event.target.value);
            }}>
            </input>

            <button className='Add' onClick={addTask}>Add</button>

        </div>

        <ol className='task-list'>
          {NewTask.map((NT, index) => (
            <li key={index} className='task-items'>
              { EditIndex === index ? ( 
                <>
                <input value={EditTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input value={EditDesc} onChange={(e) => setEditDesc(e.target.value)} />
                <button className='save-btn' onClick={saveTask}>save</button>
                <button className='cancel-btn' onClick={() => setEditIndex(null)}>cancel</button>
                </>
              ) : ( 
              <>
              <span className={`text ${NT.completed ? 'completed' : ''}`}>{NT.Title}</span>
              <span className={`text ${NT.completed ? 'completed' : ''}`}>{NT.Desc}</span>
              <button className='delete-btn' onClick={() => deleteTask(index)}>delete</button>
              <button className='completed-btn' onClick={() => completedTask(index)}>complete</button>
              <button className='edit-btn' onClick={() => editTask(index, NT)}>edit</button>
              </>
            )}
            </li>
          ))}
        </ol>


    </div>

     
  )
}
