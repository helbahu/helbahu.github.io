import { Link } from "react-router-dom";

const CompanyCard = ({company}) => {
    return (
        <Link to={`/companies/${company.handle}`}>
            <div key={company.handle} className='Companies-Company'>
                <div>
                    <h4>{company.name}</h4>
                    <p>{company.description}</p>
                </div>
                <div>
                    <img src={company.logoUrl} alt={company.name}/>
                </div>
            </div>
        </Link>
    )
}
export default CompanyCard;