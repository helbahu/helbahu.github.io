import { useState } from 'react';
import './NewTodoForm.css'

const NewTodoForm = ({addTodo,task=''}) => {
    const INITIAL_STATE = {task:task};
    const [formData,setFormData] = useState(INITIAL_STATE);
    const handleFormInputs = (e) => {
        const {name,value} = e.target;
        setFormData(formData =>({...formData, [name]:value}) );
    }

    return (
        <div className='NewTodoForm'>
            <form onSubmit={(evt)=> [addTodo(evt,formData),setFormData(INITIAL_STATE)]}>
                <label htmlFor='task'>Task: </label>
                <input id='task' name='task' type='text' onChange={handleFormInputs} value={formData.task}/>

                <button>Add Task</button>
            </form>
        </div>
    )

}

export default NewTodoForm;