import { Button } from '@mantine/core';
import { Action } from '../../types/types';
import getClient from '../../util/client';

interface Props {
  action: Action;
}

export function ActionButton({ action }: Props) {
  const mqtt = getClient();

  return (
    <>
      <Button
        variant='gradient'
        size="xl"
        onClick={() => mqtt.publish(action.topic, `${action.msg}:start()`)}
      >
        {action.title}
      </Button>
    </>
  );
}
