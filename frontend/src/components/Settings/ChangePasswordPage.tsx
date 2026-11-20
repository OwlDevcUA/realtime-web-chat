'use client';

import { useState } from "react";
import './ChangeMenu.scss';
import { redirect, useRouter } from "next/navigation";
import { changePassword } from "@/services/profileApi";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setUser } from "@/features/user/user";
import { toast } from "sonner";


export const ChangePasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [values, setValues] = useState({
      oldPass: '',
      newPass: '',
      confirmPass: '',
  });
  
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
    const validateInputs = values.oldPass || values.newPass || values.confirmPass;
  
      if (!validateInputs) {
        return;
      }
  
      try {
        const data = await changePassword(values.newPass, values.oldPass);

        if (data?.user) {
          dispatch(setUser(data.user))
        }
      } catch (err) {
        throw err
      } finally {
        setValues({
          oldPass: '',
          newPass: '',
          confirmPass: '',
        });
        toast.success("Your password has been changed", { position: "top-center" })
        redirect('/settings')
      }
    }

  
  return (
    <form className="changeMenu" onSubmit={handleSubmit}>

          <a className="settings__backBtn" onClick={() => router.back()}>Back to settings</a>

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
          name='newPass'
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