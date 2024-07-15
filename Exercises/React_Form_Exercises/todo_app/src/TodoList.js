import { useState } from 'react';
import NewTodoForm from './NewTodoForm';
import Todo from './Todo';
import {v4 as uuid} from 'uuid'

import './TodoList.css'
import PopUp from './PopUp';

const TodoList = () => {
    const [todos,setTodos] = useState([]);

    const addTodo = (evt,formData)=>{
        evt.preventDefault();
        const {task} = formData;
        setTodos(todos => [...todos,{id:uuid(), task }]);
    }

    const deleteTodo = (id) => {
        setTodos(todos => todos.filter(todo => todo.id !== id));
    }

    const editTodo = (evt,formData,id) => {
        evt.preventDefault();
        const {task} = formData;
        setTodos(todos => todos.map(todo => todo.id === id ? {...todo, task} : todo));
    }

    return (
        <div>
            <NewTodoForm addTodo={addTodo} />
            {todos.map(todo => <Todo key={todo.id} task={todo.task} deleteTodo={()=>deleteTodo(todo.id)} editTodo={(evt,formData)=>editTodo(evt,formData,todo.id)} />)}
        </div>
    )

}
export default TodoList;