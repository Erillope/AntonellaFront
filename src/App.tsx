import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import Login from "./pages/Login";
import { AuthRoute } from "./components/authRoute";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Home } from "./pages/Home";
import { HomeLayout } from "./components/HomeLayout";
import { LoginRoute } from "./components/loginRoute";
import { CreateUser } from "./components/CreateUser";
import { SearchUser } from "./pages/SearchUser";
import { AuthLayout } from "./components/AuthLayout";
import { UserInfo } from "./components/UserInfo";

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
          </Route>
        </Route>

      </Routes>
    </Router>
  )
}

export default App
