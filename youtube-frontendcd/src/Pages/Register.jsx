import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      await API.post("/users/register", formData);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-80"
      >
        <h2 className="text-white text-xl mb-4">Register</h2>

        <input placeholder="Full Name"
          className="input"
          onChange={(e)=>setForm({...form, fullName:e.target.value})}
        />

        <input placeholder="Email"
          className="input"
          onChange={(e)=>setForm({...form, email:e.target.value})}
        />

        <input placeholder="Username"
          className="input"
          onChange={(e)=>setForm({...form, username:e.target.value})}
        />

        <input type="password" placeholder="Password"
          className="input"
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />

        <input type="file"
          onChange={(e)=>setForm({...form, avatar:e.target.files[0]})}
        />

        <input type="file"
          onChange={(e)=>setForm({...form, coverImage:e.target.files[0]})}
        />

        <button className="w-full bg-red-500 p-2 mt-3 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;