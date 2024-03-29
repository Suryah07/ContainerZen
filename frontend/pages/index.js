import Head from "next/head";
import axios from "axios";
import Dashboard from "@/components/Dashboard";

const Home = ({ data }) => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
      </Head>
      <main>
        <Dashboard data={data} />
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const res = await axios.get("http://localhost:5000/api/currStats");
    if (res.status === 200) {
      return {
        props: { heading: "Home", data: res.data },
      };
    }
  } catch (error) {
    const { status: statusCode } = error.response;

    if (+statusCode === 503) {
      return {
        redirect: {
          destination: "/503",
          statusCode: 307,
        },
      };
    }
  }
};

export default Home;
