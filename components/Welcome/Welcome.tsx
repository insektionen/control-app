import { Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import useStyles from './Welcome.styles';

export function Welcome() {
  const { classes } = useStyles();

  return (
    <>
      <Title className={classes.title} align="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span">
          crApp
        </Text>
      </Title>
      <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
        crAp (Control Application) is a simple app for creating collections of buttons that control
        the lights and sound in Kistan 2.0.
      </Text>
      <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
        New here?{' '}
        <Link href="/help">
          <Anchor href="/help" size="lg">
            get started
          </Anchor>
        </Link>
        !
      </Text>
    </>
  );
}
