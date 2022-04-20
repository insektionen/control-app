import { Button, MantineGradient } from '@mantine/core';
import { Action } from '../../types/types';
import getClient from '../../util/client';

interface Props {
  action: Action;
}

export function ActionButton({ action }: Props) {
  const mqtt = getClient();

  function publish() {
    if (Array.isArray(action.msg)) {
      action.msg.map((msg) => {
        mqtt.publish(action.topic, `${msg}:start()`);
      });
    } else if (typeof action.msg === 'string') {
      mqtt.publish(action.topic, `${action.msg}:start()`);
    }
  }

  let gradient: MantineGradient = {
    from: action.color || '', 
    // TODO make it gradient
    to:   action.color || '' 
  };

  return (
    <>
      <Button 
        variant="gradient" 
        gradient={gradient}
        size="xl" onClick={publish}
      >
        {action.title}
      </Button>
    </>
  );
}
