import { Button } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../store/headerSlice";
import { Link } from "react-router-dom";

function MobilMenu() {
  const dispatch = useDispatch();
  const { mobilMenu } = useSelector((state) => state.header);

  return (
    <div
      className={`w-full  border-gray-500 p-5 flex flex-col space-y-3 bg-gray-200 border-b-2 
      rounded-b-xl dark:bg-black absolute top-14 left-0 sm:hidden 
      transition-all duration-300 ease-in-out overflow-hidden 
      ${mobilMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
    >
      {/* Kapatma Butonu 
      <Button
        size="sm"
        gradientDuoTone="purpleToBlue"
        onClick={() => dispatch(toggleMenu())}
        className="w-full"
      >
        Close
      </Button>*/}

      {/* Menü İçeriği */}
      <div className="flex flex-col space-y-3 sm:hidden px-8">
        <Link to={"/panel"}>
          <Button size="sm" outline  gradientDuoTone="greenToBlue" className="w-full">
            Panel
          </Button>
        </Link>

        <Link to={"/sign-in"}>
          <Button size="sm" outline gradientDuoTone="greenToBlue" className="w-full">
            Sign In
          </Button>
        </Link>

        <Link to={"/sign-up"}>
          <Button size="sm" outline gradientDuoTone="greenToBlue" className="w-full">
            Sign Up
          </Button>
        </Link>
        
      </div>
    </div>
  );
}

export default MobilMenu;
