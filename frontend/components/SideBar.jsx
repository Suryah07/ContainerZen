import { useState } from "react";
import Link from "next/link";
import {
  HiOutlineSquares2X2 as DashboardIcon,
  HiOutlineSquaresPlus as ApplicationIcon,
} from "react-icons/hi2";
import { RiUserSettingsLine as UserSettingIcon } from "react-icons/ri";
import { BsFillDatabaseFill as VolumesIcon } from "react-icons/bs";
import { BiDisc as ImagesIcon } from "react-icons/bi";
import { SiLinuxcontainers as ContainerIcon } from "react-icons/si";

const SideBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  const contents = [
    {
      icon: <DashboardIcon className="w-[1.4rem] h-6" />,
      name: "Dashboard",
    },
    {
      icon: <ContainerIcon className="w-[1.4rem] h-6" />,
      name: "Containers",
    },
    {
      icon: <ImagesIcon className="w-[1.4rem] h-6" />,
      name: "Images",
    },
    {
      icon: <VolumesIcon className="w-[1.4rem] h-6" />,
      name: "Volumes",
    },

    // {
    //   icon: <UserSettingIcon className="w-[1.4rem] h-6" />,
    //   name: "Settings",
    // },
  ];

  return (
    <>
      <aside className="block sm:hidden absolute bottom-0 bg-mid-dark text-light w-full p-3 z-40">
        <div className={`flex justify-center overflow-x-scroll no-scrollbar  `}>
          {contents.map((ele, index) => {
            return (
              <Link key={index + 1} href={`/${ele.name.toLowerCase()}`}>
                <MiniContainerForSmallScreen
                  key={index + 1}
                  icon={ele.icon}
                  name={ele.name}
                />
              </Link>
            );
          })}
        </div>
      </aside>
      <aside
        onMouseEnter={() => {
          setIsVisible(true);
        }}
        onMouseLeave={() => {
          setIsVisible(false);
        }}
        className={`hidden sm:block absolute bg-mid-dark text-light  h-[90vh] p-3 transition-all duration-300 ease-out z-40 ${
          !isVisible ? "w-[66px]" : "w-[236px]"
        }`}
      >
        {contents.map((ele, index) => {
          return (
            <Link
              key={index + 1}
              href={`/${
                ele.name.toLowerCase() == "dashboard"
                  ? ""
                  : ele.name.toLowerCase()
              }`}
            >
              <MiniContainerForLargerScreen
                key={index + 1}
                icon={ele.icon}
                name={ele.name}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
              />
            </Link>
          );
        })}
      </aside>
    </>
  );
};

export const MiniContainerForSmallScreen = ({ icon, name }) => {
  return (
    <div className="flex items-center flex-col mx-2">
      {icon}
      <p className="text-xs">{name}</p>
    </div>
  );
};

export const MiniContainerForLargerScreen = ({ icon, name, isVisible }) => {
  return (
    <div className="border-b border-b-gray-400 ">
      <div className="hover:bg-slate-600 rounded-md my-1 p-2 mx-auto">
        <div
          className={`flex items-center ${
            !isVisible ? "w-5rem" : "w-[13rem]"
          } text-center"`}
        >
          {icon}
          {isVisible && <p className="mx-auto font-medium">{name}</p>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
