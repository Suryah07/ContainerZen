import React from "react";
import Link from "next/link";
import { useStepperContext } from "@/contexts/StepperContext";
import axios from "axios";
import Loading from "../Loading";

const Volumes = () => {
  const { userData, setUserData } = useStepperContext();

  // const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const clickHandler = async () => {
    const {
      containername,
      image,
      restartpolicy,
      networkname,
      networktype,
      hostport,
      containerport,
      hostvolume,
      containervolume,
    } = userData;

    const data = await axios.post("http://localhost:5000/api/createcontainer", {
      containername,
      image,
      restartpolicy,
      networkname,
      networktype,
      hostport,
      containerport,
      hostvolume,
      containervolume,
    });
    if (data.status === 200) {
    } else {
    }
  };

  return (
    <div className="container md:mt-10">
      <div className="flex flex-col items-center">
        <div className="wrapper">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        <div className="w-full mx-2 flex-1">
          <div className="my-2 flex border-b border-b-gray-200 bg-transparent p-1">
            <input
              onChange={handleChange}
              value={userData["hostvolume"] || ""}
              name="hostvolume"
              placeholder="Host"
              className="p-1 px-2 bg-transparent appearance-none outline-none w-full text-light"
            />
          </div>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="my-2 flex border-b border-b-gray-200 bg-transparent p-1">
            <input
              onChange={handleChange}
              value={userData["containervolume"] || ""}
              name="containervolume"
              placeholder="Container"
              type="text"
              className="p-1 px-2 appearance-none outline-none w-full text-light bg-transparent"
            />
          </div>
        </div>
        <div className="mt-10">
          <Link href={"/applications"}>
            <button
              onClick={clickHandler}
              className="inline-block rounded bg-light text-dark py-2 px-4 text-lg font-medium hover:opacity-50"
            >
              Submit
            </button>
          </Link>
        </div>
      </div>
      {/* {loading && <Loading loadingName={"Creating"} />} */}
    </div>
  );
};

export default Volumes;
