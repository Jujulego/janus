import { Divider, Grid, List, ListItem, ListItemText, ListSubheader, makeStyles, Typography } from '@material-ui/core';
import { classToPlain } from 'class-transformer';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { IService } from '@jujulego/janus-common';

import { getDataService } from '../src/data';

// Page
export interface HomeProps {
  services: IService[];
}

const useStyles = makeStyles(({ palette }) => ({
  url: {
    padding: 2,
    borderRadius: 2,

    background: `${palette.primary.light}80`,
    color: palette.getContrastText(palette.primary.light),
  }
}));

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
        <List
          component="nav"
          subheader={
            <ListSubheader component="span">
              Services
            </ListSubheader>
          }
        >
          { services.map((service) => (
            <Link key={service.name} href={`/?service=${service.name}`} shallow passHref>
              <ListItem button component="a">
                <ListItemText
                  primary={service.name}
                  secondary={(
                    <span className={styles.url}>{ service.url }</span>
                  )}
                />
              </ListItem>
            </Link>
          )) }
        </List>
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs>
        <Typography>{ service?.name }</Typography>
        <Typography>{ service?.url }</Typography>
      </Grid>
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
