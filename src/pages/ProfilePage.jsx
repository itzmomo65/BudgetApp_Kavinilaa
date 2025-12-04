import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";

function ProfilePage() {
  return (
    <>
      <Navbar />
      <div style={{
        display: "flex",
        minHeight: "calc(100vh - 80px)"
      }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Profile />
        </div>
      </div>
    </>
  );
}

export default ProfilePage;