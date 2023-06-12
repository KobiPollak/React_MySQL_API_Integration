import React , {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import '../styles/login.css'

const Logup = () => {
    const [formValue, setFormValues] = useState({ username: '', password: '', name:'', email:'', phone:'', address:'', website:'', company:'' });
    const [data, setData] = useState();
    const navigate = useNavigate();


    const handleChange = event => {
      const { name, value } = event.target;
      setFormValues(prevState => ({ ...prevState, [name]: value }));
    }

    const handleNavigation = event => {
      console.log(event.target.name)
      if (event.target.name === "up"){
        navigate('/register');
      } else {
        navigate('/login');
      }
    }

    const handleSubmit = event => {
      event.preventDefault();
      const user = {
        userName: formValue.userName,
        password: formValue.password,
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        address: formValue.address,
        website: formValue.website
      }
      async function fetchData() {
        // await fetch(`https://jsonplaceholder.typicode.com/users?username=${formValue.username}`).
        // then(response => response.json()).
        // then(th => console.log(th))
        await fetch(`https://jsonplaceholder.typicode.com/users?username=${formValue.username}`)
          .then(response => response.json())
          .then(user => {
            if(user.length === 0){
              throw("username or password wrong. 000")
            }
            setData(user[0]);
            console.log(user[0])
            console.log(data, "11111111")
            if (user[0].address.geo.lat.slice(-4) === formValue.password){
              localStorage.setItem("user", JSON.stringify(user[0]));
              console.log("navigate")
              navigate(`/application/${user[0].id}`);
            } else {
              throw("username or password wrong. 111")
            }
            console.log(data, "2222222222222")
            }).catch(err => alert(err))
      }
      fetchData()

    }




    return (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}>
        <form onSubmit={handleSubmit} className="form-box" style={{top:"80%"}}>
            <div class="btn-field">
                <button type="button" id="signup" name="up" onClick={handleNavigation}>Sign Up</button>
                <button type="button" class="disable" id="signin" name="in" onClick={handleNavigation}>Sign In</button>
            </div>
            <label>
            Name:
            <input type="text"  name="name" className="input-field" value={formValue.name} onChange={handleChange} />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" className="input-field"  value={formValue.email} onChange={handleChange} />
          </label>
          <br />
          <label>
            Phone:
            <input type="text" name="phone" className="input-field"  value={formValue.phone} onChange={handleChange} />
          </label>
          <br />
          <label>
            Address:
            <input type="text"  name="address" className="input-field" value={formValue.address} onChange={handleChange} />
          </label>
          <br />
          <label>
            Website:
            <input type="text"  name="website" className="input-field" value={formValue.website} onChange={handleChange} />
          </label>
          <br />
          <label>
            Company:
            <input type="text"  name="company" className="input-field" value={formValue.company} onChange={handleChange} />
          </label>
          <br />
          <label>
            Username:
            <input type="text" required name="username" className="input-field" value={formValue.username} onChange={handleChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" required name="password" className="input-field"  value={formValue.password} onChange={handleChange} />
          </label>
          <br />
          <div className="connect">
          <button type="submit" className="connect">Log in</button>
          </div>
        </form>
        </motion.div>
      );
}

export default Logup;  