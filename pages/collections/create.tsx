import {
  TextInput,
  Divider,
  Group,
  Title,
  Text,
  ActionIcon,
  Card,
  Button,
  Container,
  Checkbox,
} from '@mantine/core';
import axios from 'axios';
import { useState } from 'react';
import { Plus, Trash, Check, X } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import Router from 'next/router';
import { Action } from '../../types/types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
export default function Create() {
  const exampleAction: Action = {
    title: 'Scen på',
    topic: 'light_mixer/code/run',
    msg: 'scene_on',
  };

  const [advanced, setAdvanced] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [actions, setActions] = useState<Action[]>([exampleAction]);

  function createAction() {
    setActions([
      ...actions,
      {
        title: 'Scen på',
        topic: 'light_mixer/code/run',
        msg: 'scene_on',
      },
    ]);
  }

  function deleteAction(index: number) {
    let newActions = [...actions];
    if (index == 0) {
      newActions.shift();
      setActions(newActions);
    } else {
      newActions.splice(index, 1);
      setActions(newActions);
    }
  }

  function updateAction(value: string, index: number, field: 'title' | 'msg' | 'topic') {
    let newActions = [...actions]; // copying the old datas array
    newActions[index][field] = value; // replace e.target.value with whatever you want to change it to

    setActions(newActions);
  }

  async function createPile() {
    await axios
      .post(
        `${publicRuntimeConfig.apiURL}`,
        {
          name: name,
          actions: actions,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        showNotification({
          title: 'Success',
          message: `Created collection \'${res.data.name}\'! Reload for changes to show.`,
          icon: <Check size={18} />,
          color: 'green',
        });
        Router.push('/collections');
      })
      .catch((err) => {
        showNotification({
          title: 'Error',
          message: 'Something went wrong.',
          icon: <X size={18} />,
          color: 'red',
        });
        console.error(err);
      });
  }

  return (
    <Container size="sm">
    <Title order={1} mb={25}>
      Create new
    </Title>
    <TextInput
      label="Collection name"
      placeholder="Gasque"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <Group mt="lg" spacing="xs" align="center" position="right">
      <Text size="sm" color="dimmed">
        Advanced mode
      </Text>
      <Checkbox checked={advanced} onClick={() => setAdvanced(!advanced)} size="xs" />
    </Group>
    <Divider my="lg" />
    <Group mb="lg" position="apart">
      <Title order={2} sx={{ fontSize: 18 }}>
        Actions
      </Title>
      <ActionIcon onClick={() => createAction()} variant="filled" color="green">
        <Plus size={18} />
      </ActionIcon>
    </Group>
    <Group grow direction="column">
      {actions.map((action, i) => (
        <Card withBorder shadow="sm" key={i} mb="lg">
          <Group position="right">
            <ActionIcon onClick={() => deleteAction(i)} color="red" variant="filled">
              <Trash size={18} />
            </ActionIcon>
          </Group>
          <TextInput
            label="Label"
            onChange={(e) => updateAction(e.target.value, i, 'title')}
            value={action.title}
          />
          {advanced && (
            <TextInput
              label="Topic"
              onChange={(e) => updateAction(e.target.value, i, 'topic')}
              value={action.topic}
            />
          )}
          <TextInput
            label={advanced ? 'Message' : 'Script name'}
            onChange={(e) => updateAction(e.target.value, i, 'msg')}
            value={action.msg}
          />
        </Card>
      ))}
    </Group>
    <Button
      fullWidth
      color="green"
      variant="filled"
      leftIcon={<Plus />}
      onClick={() => createPile()}
    >
      Create
    </Button>
  </Container>
  );
}
