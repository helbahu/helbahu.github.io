import { Link } from "react-router-dom";

const JobCard = ({job}) => {
    return(
        <Link to={`/jobs/${job.id}`}>
            <div key={job.id} className='Jobs-Job'>
                <h4>{job.title}</h4>
                <h5>Salary: {job.salary || "N/A"}</h5>
                <h5>Company: {job.companyName || job.company?.name} </h5>
            </div>
        </Link>
    )

}
export default JobCard;