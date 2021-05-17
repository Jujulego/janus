import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  NoSsr,
  Paper
} from '@material-ui/core';
import { classToPlain } from 'class-transformer';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { IService } from '@jujulego/janus-common';

import { getDataService } from '../src/data';
import { ServiceHeader } from '../src/services/ServiceHeader';
import { ServiceGraph } from '../src/services/ServiceGraph';

// Types
export interface HomeProps {
  services: IService[];
}

// Styles
const useStyles = makeStyles(({ palette }) => ({
  url: {
    padding: 2,
    borderRadius: 2,

    background: `${palette.primary.light}80`,
    color: palette.getContrastText(palette.primary.light),
  }
}));

// Page
const Home: NextPage<HomeProps> = (props) => {
  const { services } = props;

  // Contexts
  const router = useRouter();

  // Memos
  const service = useMemo(() => {
    return services.find((srv) => srv.name === router.query.service);
  }, [services, router.query]);

  // Render
  const styles = useStyles();

  return (
    <Grid container sx={{ flex: 1 }}>
      <Grid item xs={2}>
        <Paper square sx={{ height: '100%' }}>
          <List
            component="nav"
            subheader={
              <ListSubheader component="span" sx={{ bgcolor: 'transparent' }}>
                Services
              </ListSubheader>
            }
          >
            { services.map((service) => (
              <Link key={service.name} href={`/?service=${service.name}`} shallow passHref>
                <ListItem button component="a">
                  <ListItemText
                    primary={service.name}
                    secondary={service.url}
                    secondaryTypographyProps={{ color: 'primary.light' }}
                  />
                </ListItem>
              </Link>
            )) }
          </List>
        </Paper>
      </Grid>
      { service && (
        <Grid
          item xs
          container direction="column"
          p={2}
        >
          <Grid item xs="auto">
            <ServiceHeader service={service} />
          </Grid>

          <Grid item xs>
            <ServiceGraph service={service} />
          </Grid>
        </Grid>
      ) }
    </Grid>
  );
};

export default Home;

// Props
export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const data = getDataService(ctx);

  return {
    props: {
      services: classToPlain(data.listServices()) as IService[]
    }
  };
};
