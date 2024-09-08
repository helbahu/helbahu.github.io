import './Header.css';

const Header = ({title,rightComponent=null,leftComponent=null}) => {
    return(
        <div className='Header-Container'>
            <div className='Header-Fringe'>
                {leftComponent}
            </div>
            <div className='Header'>
                <h2>{title}</h2>
            </div>
            <div className='Header-Fringe'>
                {rightComponent}
            </div>
        </div>
    )

}
export default Header;