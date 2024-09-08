import './FilterForm.css';
import PopupFilterForm from "./PopupFilterForm";
import useBoolean from "./useBoolean";

const FilterForm = ({setCompanies=null,setJobs=null}) => {
    const [isFilterFormActive,toggleFilterForm] = useBoolean();

    return (
        <>
            <div className='Filter-Btn' onClick={toggleFilterForm}></div>
            {isFilterFormActive && <PopupFilterForm setJobs={setJobs} setCompanies={setCompanies} hideForm={toggleFilterForm}/>}        
        </>
    )

}
export default FilterForm;