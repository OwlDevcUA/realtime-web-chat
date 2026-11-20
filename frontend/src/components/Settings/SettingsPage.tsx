'use client';

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import './SettingsPage.scss';
import { changeName } from "@/services/profileApi";
import Link from "next/link";
import { setUser } from "@/features/user/user";
import { toast } from "sonner";
import { logout } from "@/services/authApi";

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();
  
  const [active, setActive] = useState(false)

  const [username, setUsername] = useState(user?.username)

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (user?.username === username) {
      return setActive(false);
    }

    try {
      if (username) {
        const update = await changeName(username)
        dispatch(setUser(update))
      }
    } catch (err) {
      throw err
    } finally {
      setActive(false);
      toast.success("Your username has been changed", { position: "top-center" })
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUser(null))
    } catch (err) {
      throw err
    } finally {
      redirect('/login')
    }
  }

  return (
    <div className="settings">
      <a className="settings__backBtn" onClick={() => router.back()}>Back</a>
      <div className="settings__profileCard">
      {active ? (
        <form className="changeMenu" onSubmit={handleSubmit}>

          <a onClick={() => setActive(false)} className="changeMenu__cancle">Cancle</a>

        Username:
        <input 
          className="changeMenu__input"
          type="text"
          name='name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <button type="submit" className="changeMenu_submit">Submit</button>
      </form>
        ) : (
            <div className="settings__profileField">
              <h3
              className="settings__profileCardText">
              Name: {user?.username}
            </h3>
          <button
            className="settings__editBtn"
            onClick={() => setActive(true)}
            >
            Edit
            </button>
          </div>     
      )}
      
        <div className="settings__profileInfo">
          <div className="settings__profileField">
          <h3 className="settings__profileCardText">Email: {user?.email}</h3>
           <Link
              href={'/settings/changeEmail'}
              className="settings__editBtn">
              Edit
          </Link>
          </div>
          <div className="settings__profileField">
               
          <Link
            href={'/settings/changePassword'}
            className="settings__editPasswordBtn">
            Change Password
          </Link>
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className="settings__logoutBtn">Logout</button>
    </div>
  )
}