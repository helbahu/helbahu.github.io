import { Routes as RoutesComponent, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import SignUp from './SignUp';
import Companies from './Companies';
import Company from './Company';
import Jobs from './Jobs';
import Job from './Job';
import User from './User';
import Users from './Users';
import Profile from './Profile';

const Routes = () => {
    return (
            <RoutesComponent>
              <Route path='/' element={<HomePage/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<SignUp/>} />
              <Route path='/companies/:handle' element={<Company/>} />
              <Route path='/companies' element={<Companies/>} />
              <Route path='/jobs/:id' element={<Job/>} />
              <Route path='/jobs' element={<Jobs/>} />
              <Route path='/users/:username' element={<User/>} />
              <Route path='/users' element={<Users/>} />
              <Route path='/profile' element={<Profile/>} />
              <Route path='*' element={<Navigate to={'/'}/>} />
            </RoutesComponent>
    )

}
export default Routes;