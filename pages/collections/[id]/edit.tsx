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
import { Plus, Trash, DeviceFloppy, Check, X } from 'tabler-icons-react';
import { Action, Pile } from '../../../types/types';

import { showNotification } from '@mantine/notifications';
import Router from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPiles } from '../../api';
import { getPile } from '../../api/[id]';

interface Props {
  pile: Pile;
}

export default function EditPile({ pile }: Props) {
  const exampleAction: Action = {
    title: 'Scen på',
    topic: 'light_mixer/code/run',
    msg: 'scene_on',
  };

  const [advanced, setAdvanced] = useState<boolean>(false);
  const [name, setName] = useState<string>(pile.name);
  const [actions, setActions] = useState<Action[]>(pile.actions);

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
      newActions.splice(index);
      setActions(newActions);
    }
  }

  function updateAction(value: string, index: number, field: 'title' | 'msg' | 'topic') {
    let newActions = [...actions]; // copying the old datas array
    newActions[index][field] = value; // replace e.target.value with whatever you want to change it to

    setActions(newActions);
  }

  async function updatePile(id: string) {
    await axios
      .put(
        `http://localhost:3000/api/${id}`,
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
          message: `Updated collection \'${res.data.name}\'! Reload for changes to show.`,
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
        Editing {pile.name}
      </Title>
      <TextInput
        label="Collection name"
        placeholder="Gasque"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Group mt={'lg'} spacing="xs" align={'center'} position="right">
        <Text size="sm" color="dimmed">
          Advanced mode
        </Text>
        <Checkbox checked={advanced} onClick={() => setAdvanced(!advanced)} size="xs" />
      </Group>
      <Divider my={'lg'} />
      <Group mb={'lg'} position="apart">
        <Title order={2} sx={{ fontSize: 18 }}>
          Actions
        </Title>
        <ActionIcon onClick={() => createAction()} variant="filled" color="green">
          <Plus size={18} />
        </ActionIcon>
      </Group>
      <Group grow direction="column">
        {actions.map((action, i) => (
          <Card withBorder shadow={'sm'} key={i} mb={'lg'}>
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
        leftIcon={<DeviceFloppy />}
        onClick={() => updatePile(pile._id)}
      >
        Save
      </Button>
    </Container>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const data = await getPile(context.params?.id?.toString()!);
  return {
    props: {
      pile: data!,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getPiles();
  const paths = data.map((pile) => ({ params: { id: pile._id.toString() } }));
  return {
    paths: paths,
    fallback: 'blocking', // false or 'blocking',
  };
};
