import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const loginUser = () => {
        axios.post("https://quickshow-jn4r.onrender.com/api/auth/login", {
            email,
            password
        })
        .then(res => {
            localStorage.setItem("token", res.data.token);
            console.log("Login success", res.data); 
            toast.success("Login Successful");
            navigate("/"); //login hone k bad home page
        })
        .catch(err => {
            console.log(err);
            alert("Invalid Credentials ❌");
    });
};

    return (
        <div>
            <h2>Login 🔐</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

            <button onClick={loginUser}>Login</button>
        </div>
    );
}

export default Login;