import { Navigate } from "react-router-dom";
import keycloak from "../components/keycloak/keycloak";


const withAuth = Component => props => {
    if(keycloak.authenticated){ 
        return <Component {...props}/>
    }else{
        return <Navigate to="/"/>
    }
}
export default withAuth;