import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthContextProvider} from "./contexts/AuthContext";
import MainLayout from "./views/MainLayout";
import {BrowserRouter as Router} from "react-router-dom";
import './App.css'

export default function App() {
    return (
        <Router>
            <AuthContextProvider>
                <MainLayout/>
            </AuthContextProvider>
        </Router>
    );
}