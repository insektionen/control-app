import {
  TextInput,
  Divider,
  Group,
  Title,
  Tooltip,
  ActionIcon,
  Card,
  Button,
  Container,
} from '@mantine/core';
import axios from 'axios';
import { useState } from 'react';
import { Plus, Trash, DeviceFloppy } from 'tabler-icons-react';
import { Action, Pile } from '../../types/types';

export default function Create() {
  const exampleAction: Action = {
    title: 'Scen på',
    topic: 'light_mixer/code/run',
    msg: 'scene_on',
  };

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
    if (index == 0) {
      let newActions = [...actions];
      newActions.shift();
      setActions(newActions);
    } else {
      setActions([...actions].splice(index));
    }
  }

  function updateAction(value: string, index: number, field: 'title' | 'msg' | 'topic') {
    let newActions = [...actions]; // copying the old datas array
    newActions[index][field] = value; // replace e.target.value with whatever you want to change it to

    setActions(newActions);
  }

  function createPile() {
    axios.post(
      'http://localhost:3000/api',
      {
        name: name,
        actions: actions,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return (
    <Container size="sm">
      <Title order={1} mb={25}>
        Create new collection
      </Title>
      <TextInput
        label="Namn"
        placeholder="Gasque"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Divider my={25} />
      <Group mb={12} position="apart">
        <Title order={2} sx={{ fontSize: 18 }}>
          Actions
        </Title>
        <ActionIcon onClick={() => createAction()} variant="filled" color="green">
            <Plus size={18} />
        </ActionIcon>
      </Group>
      <Group grow direction='column'>
        {actions.map((action, i) => (
          <Card key={i} mb={20}>
            <Group position="right">
              <ActionIcon onClick={() => deleteAction(i)} color="red" variant="filled">
                <Trash size={18} />
              </ActionIcon>
            </Group>
            <TextInput
              label="Title"
              onChange={(e) => updateAction(e.target.value, i, 'title')}
              value={action.title}
            />
            <TextInput
              label="Topic"
              onChange={(e) => updateAction(e.target.value, i, 'topic')}
              value={action.topic}
            />
            <TextInput
              label="Message"
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
        leftIcon={<DeviceFloppy />}
        onClick={() => createPile()}
      >
        Spara
      </Button>
    </Container>
  );
}
