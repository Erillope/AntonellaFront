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
import { SearchService } from "./pages/SearchService";
import { ServiceTypeInfo } from "./pages/ServiceTypeInfo";
import { ServiceInfo } from "./pages/ServiceInfo";
import { CreateProduct } from "./pages/CreateProduct";
import { SearchProduct } from "./pages/SearchProduct";
import { EditProduct } from "./pages/EditProduct";
import { CreateCita } from "./pages/CreateCita";
import { CreateServiceForm } from "./pages/CreateServiceForm";
import { ServiceInfoForm } from "./pages/ServiceInfoForm";

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
            <Route path="service/search/" element={<SearchService/>}/>
            <Route path="service/create/form/" element={<CreateServiceForm/>}/>
            <Route path="service/search/form/:id" element={<ServiceInfoForm/>}/>
            <Route path="service/:type" element={<ServiceTypeInfo/>}/>
            <Route path="service/search/:id" element={<ServiceInfo/>}/>
            <Route path="product/create/" element={<CreateProduct/>}/>
            <Route path="product/search/" element={<SearchProduct/>}/>
            <Route path="product/search/:id" element={<EditProduct/>}/>
            <Route path="citas/create/" element={<CreateCita/>}/>
            <Route path="citas/search/" element={<div>Citas Search Page</div>}/>
          </Route>
        </Route>

      </Routes>
    </Router>
  )
}

export default App
