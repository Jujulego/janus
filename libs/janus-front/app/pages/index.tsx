import { Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';

import { IService } from '@jujulego/janus-common';
import { useEffect } from 'react';

// Props
export interface HomeProps {
  services: IService[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const data = (ctx.req as any).data;

  return {
    props: {
      services: JSON.parse(JSON.stringify(data.listServices()))
    }
  };
};

// Page
const Home: NextPage<HomeProps> = (props) => {
  const { services } = props;

  // Effects
  useEffect(() => {
    console.log(services);
  }, [services]);

  // Render
  return (
    <Typography variant="h1">Hello, world!</Typography>
  );
};

export default Home;
