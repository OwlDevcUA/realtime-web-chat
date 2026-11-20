'use client';

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import './ChangeMenu.scss';
import { changeEmail } from "@/services/profileApi";
import { setUser } from "@/features/user/user";
import { toast } from "sonner";


export const ChangeEmailPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [values, setValues] = useState({
      email: user?.email || '',
      password: '',
  });
  const [message, setMessage] = useState(false);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (values.email === '' || values.password === '') {
      return;
    }

    try {
      const data = await changeEmail(values.password, values.email)
      if (data?.user) {
        dispatch(setUser(data.user))
      }
    } catch (err) {
      throw err
    } finally {
      setValues({
        email: '',
        password: '',
      });
      setMessage(true);
      toast.success("Your email has been changed", { position: "top-center" })
    }
  }

  return (
    <div className="changeMenu">
      <a className="changeMenu__backBtn" onClick={() => router.back()}>Back to settings</a>

      {message ? (
        <h1>Please, check your new email</h1>
      ) : (
          <form className="changeMenu__form" onSubmit={handleSubmit}>

        Password:
        <input 
          className="changeMenu__input"
          type="text"
          name='password'
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
      )}
    </div>
  )
}