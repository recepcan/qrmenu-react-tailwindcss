import { Button, FileInput, Label, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="w-full min-h-screen flex items-start justify-center  p-4 ">

      <div className="w-96 bg-gray-300 dark:bg-gray-800 rounded-lg p-5 space-y-5 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-4">
          {/* Kullanıcının mevcut profil resmi */}
          <img
            src={currentUser.profilePicture}
            className="w-20 h-20 rounded-full border"
            alt="Profil Fotoğrafı"
          />

          {/* Dosya yükleme inputu */}
          <div>
            <FileInput
              sizing="sm"
              id="file-upload-helper-text"
              helperText="Upload Image" />
          </div>
        </div>
        <TextInput
          className="w-full"
          type="text"
          placeholder="username"
          value={currentUser.username} />
        <TextInput
          className="w-full"
          type="email"
          placeholder="email"
          value={currentUser.email} />
        <TextInput
          className="w-full"
          type="password"
          placeholder="password"
          value={currentUser.password} />

        <Button gradientDuoTone="purpleToBlue" className="w-full">Update User </Button>
        <p>isadmin: {currentUser?.isAdmin.toString()}</p>
        <p>id: {currentUser?._id}</p>
      </div>



    </div>
  );
}

export default Profile;
