import React, {useEffect, useState} from "react";
import Image from "next/image";
import { Image1, Profile } from "../../src/assets";
import Card from "../../src/components/find_user/Card";
import { fetchAllUsers } from "../api";
const FindUsers = () => {

    const[users, setUsers] = useState();
 users && console.log(users)
  useEffect(() => {
    getAllUsers();
  }, []);

  //find users
  const getAllUsers = async () => {
    const { data } = await fetchAllUsers();
    console.log(data);
    setUsers(data);
  };

  return (
    <>
      <p className="text-2xl font-bold text-center mt-10 mb-5">Find Users</p>
      <div className="grid grid-cols-4 mt-5 mx-10    ">
        <Card users={users}/>
      </div>
    </>
  );
};

export default FindUsers;
