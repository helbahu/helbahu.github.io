import './FormInput.css';

const FormInput = ({children, label, name, value, handleChange,type='text',min=null,max=null,step=1,required=true}) => {

    if(type === 'number'){
        return (
            <div>
                <div className="FormInput-Label">
                    <label htmlFor={name}>{label}</label>
                </div>
                <div>
                    <input className='FormInput-Input' id={name} name={name} type={type} placeholder={label} value={value} onChange={handleChange} min={min} max={max} step={step}/>
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


    return (
        <div>
            <div className="FormInput-Label">
                <label htmlFor={name}>{label}</label>
            </div>
            <div>
                <input className='FormInput-Input' id={name} name={name} type={type} placeholder={label} value={value} onChange={handleChange}  minLength={min || 1} maxLength={max} required={required}/>            
            </div>
        </div>
    )
}
export default FormInput;