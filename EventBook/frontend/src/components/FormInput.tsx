import { ChangeEventHandler, useState } from 'react';
import './FormInput.css';

interface ComponentObj {
    children?:any, 
    label?:string, 
    name?:string, 
    value?:any, 
    handleChange:ChangeEventHandler,
    type?:string,
    checkboxQuestion?:string,
    min?:number | undefined,
    max?:number | undefined,
    step?:number,
    required?:boolean
}

const FormInput = ({children, label, name, value, handleChange,type='text',checkboxQuestion='',min=undefined,max=undefined,step=1,required=true}:ComponentObj) => {
    const [fileName,setFileName] = useState('');

    if(type === 'textarea'){
        return (
            <div>
                <div className="FormInput-Label">
                    <label htmlFor={name}>{label}</label>
                </div>
                <div>
                    <textarea className='FormInput-Input' id={name} name={name} placeholder={required ? label : `${label} (optional)`} value={value} onChange={handleChange}  minLength={min || 1} maxLength={max} required={required}/>
                </div>
            </div>
        )

    }

    if(type === 'number'){
        return (
            <div>
                <div className="FormInput-Label">
                    <label htmlFor={name}>{label}</label>
                </div>
                <div>
                    <input className='FormInput-Input' id={name} name={name} type={type} placeholder={required ? label : `${label} (optional)`} value={value} onChange={handleChange} min={min} max={max} step={step}/>
                </div>
            </div>
        )
    }


    if(type === 'select'){
        return (
            <div className='FormInput-Select'>
                <div className="FormInput-Label">
                    <label htmlFor={name}>{label}</label>
                </div>
                <div>
                    <select id={name} name={name} value={value}  onChange={handleChange}>
                        {children}
                    </select>
                </div>
            </div>
        )

    }



    if(type === 'file'){
        return (
            <div>
                <div className="FormInput-Label">
                    <label htmlFor={name}>{label}</label>
                </div>
                <div className='FormInput-FileInput'>
                    <input id={name} name={name} type='file' accept="image/*" placeholder={required ? label : `${label} (optional)`} onChange={(e:any)=>{handleChange(e); setFileName(file=>`${e.target.files[0].name} - ${Math.round(e.target.files[0].size/1000)}KB`)}}  minLength={min || 1} maxLength={max} required={required}/>
                    <label htmlFor={name} >Select file</label><span>{fileName}</span>
                </div>
            </div>
        )

    }

    if(type === 'date' || type === 'datetime-local'){
    return (
        <div>
            <div className="FormInput-Label">
                <label htmlFor={name}>{label}</label>
            </div>
            <div>
                {/* <input className='FormInput-Input' type='date' /> */}
                <input className='FormInput-Input' id={name} name={name} type={type} value={value} onChange={handleChange} required={required}/>
            </div>
        </div>
    )


    }

    if(type === 'checkbox'){
        return (
            <div>
                <label className="FormInput-Checkbox">{checkboxQuestion}
                    <input id={name} name={name} type='checkbox' defaultChecked={value} onChange={handleChange}/>
                    <span className="checkmark"></span>
                </label>
            </div>
        )

    }

    return (
        <div>
            <div className="FormInput-Label">
                <label htmlFor={name}>{label}</label>
            </div>
            <div>
                <input className='FormInput-Input' id={name} name={name} type={type} placeholder={required ? label : `${label} (optional)`} value={value} onChange={handleChange}  minLength={min || 1} maxLength={max} required={required}/>
            </div>
        </div>
    )

}
export default FormInput;