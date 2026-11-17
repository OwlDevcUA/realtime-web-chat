'use client';

import { useState } from "react";


export const ChangePasswordPage: React.FC = () => {
  
  const [values, setValues] = useState({
      oldPass: '',
      newPass: '',
      confirmPass: '',
  });
  
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };

  
  return (
    <form className="changeMenu">

          <a>Close</a>

          Old Password:
        <input 
          className="changeMenu__input"
          type="text"
          name='oldPass'
          value={values.oldPass}
          onChange={(e) => handleChange(e)}
          required
          />
          
          New Password:
        <input 
          className="changeMenu__input"
          type="text"
          name='new'
          value={values.newPass}
          onChange={(e) => handleChange(e)}
          required
          />
          
        
          Confirm Password:
        <input 
          className="changeMenu__input"
          type="text"
          name='confirmPass'
          value={values.confirmPass}
          onChange={(e) => handleChange(e)}
          required
        />

        <button type="submit" className="changeMenu_submit">Submit</button>
      </form>
  )
}