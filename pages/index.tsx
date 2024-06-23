import Head from 'next/head';

import HomePage from 'pages/home';

function MainView() {
  return (
    <>
      <Head>
        <title>General Dashboard</title>
      </Head>
      <HomePage />
    </>
  );
}

export default MainView;
