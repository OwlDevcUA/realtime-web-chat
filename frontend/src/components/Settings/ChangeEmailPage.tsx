'use client';

import { useAppSelector } from "@/hooks/hooks";
import { useState } from "react";


export const ChangeEmailPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };

  const [values, setValues] = useState({
      email: user?.email,
      password: '',
    });
  
  return (
    <form className="changeMenu">

        <a>Close</a>

        Password:
        <input 
          className="changeMenu__input"
          type="text"
          name='oldPass'
          value={values.password}
          onChange={(e) => handleChange(e)}
          required
        />

        New Email:
        <input 
          className="changeMenu__input"
          type="text"
          name='email'
          value={values.email}
          onChange={(e) => handleChange(e)}
          required
        />

        <button type="submit" className="changeMenu_submit">Submit</button>
      </form>
  )
}