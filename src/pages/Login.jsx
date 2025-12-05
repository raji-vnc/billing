import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

export default function Login(){
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("")
        try{
            const res=await api.post("/token/",{username,password});
            localStorage.setItem("access",res.data.access);
            localStorage.setItem("refresh",res.data.refresh);
            navigate("/products");
        }
        catch(err){
            console.log(err)
            setError("Invalid username or password")
        }
        finally{
            setLoading(false);
        }
    };
return(
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-4 text-center">Billing System Login</h2>
            {error &&(<p className="text-sm text-red-600 mb-3 text-center">{error}</p>)}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">Username</label>
                    <input type="text" className="w-full border rounded p-2 text-sm" value={username} onChange={(e)=>
                        setUsername(e.target.value) } required autoComplete="username"/>
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input type="text" className="w-full border rounded p-2 text-sm" value={password} onChange={(e)=>
                        setPassword(e.target.value) } required autoComplete="current-password"/>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded mt-2 text-sm font-medium disabled:opacity-60">{loading?"Logging in...":"Login"}</button>
            </form>
        </div>
    </div>
)
}