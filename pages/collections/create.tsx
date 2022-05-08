import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import Router from 'next/router';
import { Check, X } from 'tabler-icons-react';
import EditPile from '../../components/EditPile/EditPile';
import { Action, Pile } from '../../types/types';

const { NEXT_PUBLIC_API_URL } = process.env;

async function createPile(name: string, actions: Action[]) {
  await axios
    .post(
      `${NEXT_PUBLIC_API_URL}`,
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


const exampleAction: Action = {
  title: 'Scen på',
  topic: 'light_mixer/code/run',
  msg: 'scene_on',
};

const newPile: Pile = {
  _id: '',
  name: '',
  actions: [exampleAction]
}

export default function Create() {

  return (
    <EditPile pile={newPile} setPileCallback={createPile}/>
  )
}
