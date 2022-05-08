import { GetStaticPaths, GetStaticProps } from 'next';
import { Action, Pile } from '../../../types/types';
import { getPiles } from '../../api';
import { getPile } from '../../api/[id]';
import EditPile from '../../../components/EditPile/EditPile';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import Router from 'next/router';
import { Check, X } from 'tabler-icons-react';

interface Props {
  pile: Pile;
}

async function updatePile(name: string, actions: Action[], id: string) {
  await axios
    .put(
      location.origin + `/${id}`,
      {
        name,
        actions,
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

export default function Edit({ pile }: Props) {
  return (
    <EditPile pile={pile} />
  ) 
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const data = await getPile(context.params?.id?.toString()!);
  return {
    props: {
      pile: data!,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getPiles();
  const paths = data.map((pile) => ({ params: { id: pile._id.toString() } }));
  return {
    paths,
    fallback: 'blocking', // false or 'blocking',
  };
};
