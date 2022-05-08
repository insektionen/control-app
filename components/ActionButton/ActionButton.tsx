import { Button, MantineGradient } from '@mantine/core';
import { Action } from '../../types/types';
import getClient from '../../util/client';

interface Props {
  action: Action;
}

function componentToHex(c: number) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

const gradient = 50;
/**
 * Limit a value between 0 and 255
 */
function limitRGB(value: number) {
  return Math.max(Math.min(value, 255), 0)
}

function addGradient(hex: string) {
  let rgb = hexToRgb(hex);
  let result = rgb ? rgbToHex(limitRGB(rgb.r + gradient), limitRGB(rgb.g + gradient), limitRGB(rgb.b + gradient)) : hex;
  return result;
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
    to: addGradient(action.color || '') 
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
