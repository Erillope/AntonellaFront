import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import { Login } from "./pages/Login";
import { AuthRoute } from "./components/authRoute";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Home } from "./pages/Home";
import { HomeLayout } from "./components/HomeLayout";
import { LoginRoute } from "./components/loginRoute";
import { CreateUser } from "./pages/CreateUser";
import { SearchUser } from "./pages/SearchUser";
import { AuthLayout } from "./components/AuthLayout";
import { UserInfo } from "./pages/UserInfo";
import { CreateRole } from "./pages/CreateRole";
import { SearchRole } from "./pages/SearchRole";
import { RoleInfo } from "./pages/RoleInfo";
import { CreateService } from "./pages/CreateService";

function App() {

  return (
    <Router>
      <Routes>

        <Route element={<AuthLayout/>}>
          <Route element={<LoginRoute/>}>
            <Route path="/login/" element={<Login/>} />
          </Route>
      
          <Route path="/password/reset/" element={<ForgotPassword />} />
          <Route path="/password/reset/:tokenId" element={<ResetPassword/>} />
        </Route>

        <Route element={<AuthRoute />}>
          <Route element={<HomeLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="user/create/" element={<CreateUser/>}/>
            <Route path="user/search/" element={<SearchUser/>}/>
            <Route path="user/search/:userId" element={<UserInfo/>}/>
            <Route path="role/create/" element={<CreateRole/>}/>
            <Route path="role/search/" element={<SearchRole/>}/>
            <Route path="role/search/:roleId" element={<RoleInfo/>}/>
            <Route path="service/create/" element={<CreateService/>}/>
          </Route>
        </Route>

      </Routes>
    </Router>
  )
}

export default App
