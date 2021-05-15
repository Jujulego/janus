import { Divider, Grid, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';

import { IService } from '@jujulego/janus-common';

import { getDataService } from '../src/data';

// Page
export interface HomeProps {
  services: IService[];
}

const Home: NextPage<HomeProps> = (props) => {
  const { services } = props;

  // Render
  return (
    <Grid container sx={{ flex: 1 }}>
      <Grid item xs={2}>
        <List
          subheader={
            <ListSubheader>
              Services
            </ListSubheader>
          }
        >
          { services.map((service) => (
            <ListItem button>
              <ListItemText
                primary={service.name}
                secondary={service.url}
              />
            </ListItem>
          )) }
        </List>
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs />
    </Grid>
  );
};

export default Home;

// Props
export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const data = getDataService(ctx);

  return {
    props: {
      services: JSON.parse(JSON.stringify(data.listServices()))
    }
  };
};
