import { useState } from 'react';
import './Todo.css'
import PopUp from './PopUp';
import NewTodoForm from './NewTodoForm';

const Todo = ({task, deleteTodo, editTodo}) => {
    const [deleteBtn,setDeleteBtn] = useState(false);
    const [popUpActive,setPopUpActive] = useState(false);

    const togglePopUp = () => {
        setPopUpActive(!popUpActive);
    }

    return (
        <div className='Task'
             onMouseEnter={()=>setDeleteBtn(true)}
             onMouseLeave={()=>setDeleteBtn(false)}>
            <h2>{task}</h2>
            {deleteBtn && (
                            <div>
                                <button className='Task-EditBtn' onClick={togglePopUp} >Edit</button>
                                <button className='Task-DeleteBtn' onClick={deleteTodo}>X</button>
                            </div>
                          )}

            <PopUp isActive={popUpActive} closePopUp={togglePopUp} >
                <NewTodoForm addTodo={(evt,formData)=>{editTodo(evt,formData); togglePopUp() }} task={task}/>
            </PopUp>

            
        </div>
    )
}

export default Todo;