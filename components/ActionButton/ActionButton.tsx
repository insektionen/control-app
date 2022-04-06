import { Button } from '@mantine/core';
import { Action } from '../../types/types';
import getClient from '../../util/client';

interface Props {
  action: Action;
}

export function ActionButton({ action }: Props) {
  const mqtt = getClient();

  function publish() {
    if(Array.isArray(action.msg)) {
      action.msg.map(msg => {
        mqtt.publish(action.topic, `${msg}:start()`)
      })
    } else if(typeof action.msg == 'string') {
      mqtt.publish(action.topic, `${action.msg}:start()`)
    }
  }

  return (
    <>
      <Button
        variant='gradient'
        size="xl"
        onClick={() => publish()}
      >
        {action.title}
      </Button>
    </>
  );
}
