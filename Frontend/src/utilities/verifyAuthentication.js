import jwtDecode from 'jwt-decode';

const isAdminAuthenticated = () => {
    try {
        const { role } = jwtDecode(localStorage.getItem("token"));
        return !(("admin").localeCompare(role));
    } catch (error) {
        return;
    }
};

const isUserAuthenticated = () => {
    try {
        const { role } = jwtDecode(localStorage.getItem("token"));
        return !(("user").localeCompare(role));
    } catch (error) {
        return;
    }
};


export default {isAdminAuthenticated, isUserAuthenticated};