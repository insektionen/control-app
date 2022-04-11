import React, { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Center,
  Group,
  Container,
  Button,
} from '@mantine/core';
import { Code, QuestionMark, Stack2 } from 'tabler-icons-react';
import Router from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export default function Layout(props: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Group grow direction="column">
            <Button
              onClick={() => {
                Router.push('/collections');
                setOpened(false);
              }}
              size="md"
              variant="default"
              leftIcon={<Stack2 size={18} />}
            >
              Collections
            </Button>
            <Button
              onClick={() => {
                Router.push('/help');
                setOpened(false);
              }}
              size="md"
              variant="default"
              leftIcon={<QuestionMark size={18} />}
            >
              Help
            </Button>
            <Button size="md" variant="default" disabled leftIcon={<QuestionMark size={18} />}>
              Coming soon...
            </Button>
          </Group>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <Center>Built with 🍺 by SMN</Center>
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Link href="/" passHref>
              <Group sx={{ cursor: 'pointer' }}>
                <Image src="/in_logo.png" height={30} width={30} />
                <Text size="xl" weight="bold">
                  crAp
                </Text>
              </Group>
            </Link>
            <div style={{ flexGrow: 1 }}></div>
            <ColorSchemeToggle />
          </div>
        </Header>
      }
    >
      <Container>{props.children}</Container>
    </AppShell>
  );
}
