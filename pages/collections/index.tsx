import { Group, Menu, Title, ActionIcon } from '@mantine/core';
import axios from 'axios';
import { GetStaticProps } from 'next';
import Router from 'next/router';
import { Check, Pencil, Plus, Trash, X } from 'tabler-icons-react';
import CollectionListItem from '../../components/List/CollectionListItem';
import { Pile } from '../../types/types';
import { getPiles } from '../api';
import { showNotification } from '@mantine/notifications';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
interface Props {
  piles: Pile[];
}

async function handleDelete(id: string) {
  await axios
    .delete(`${publicRuntimeConfig.apiURL}/${id}`)
    .then((res) =>
      showNotification({
        title: 'Success',
        message: res.data + ' Reload for changes to show.',
        icon: <Check size={18} />,
        color: 'green',
      })
    )
    .catch((err) => {
      console.error(err);
      showNotification({
        title: 'Error',
        message: 'Something went wrong.',
        icon: <X size={18} />,
        color: 'red',
      });
    });
}

export default function Collections(props: Props) {
  return (
    <>
      <Group position="apart">
        <Title order={1} mb="lg">
          Collections
        </Title>
        <ActionIcon
          onClick={() => Router.push('/collections/create')}
          color="green"
          variant="filled"
        >
          <Plus size={18} />
        </ActionIcon>
      </Group>
      <Group grow direction="column">
        {props.piles.map((pile) => (
          <CollectionListItem
            onClick={() => Router.push(`/collections/${pile._id}`)}
            label={pile.name}
            key={pile._id}
            menu={
              <>
                <Menu.Item
                  onClick={() => Router.push(`/collections/${pile._id}/edit`)}
                  icon={<Pencil size={16} color="orange" />}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleDelete(pile._id)}
                  icon={<Trash size={16} color="red" />}
                >
                  Delete
                </Menu.Item>
              </>
            }
          />
        ))}
      </Group>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const data = await getPiles();
  return {
    props: {
      piles: data!,
    },
    revalidate: 1,
  };
};
