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
  ColorInput,
  DEFAULT_THEME,
} from '@mantine/core';
import axios from 'axios';
import { useState } from 'react';
import { Plus, Trash, Check, X } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import Router from 'next/router';
import { Action, Pile } from '../../types/types';
import EditPile from '../../components/EditPile/EditPile';

const { NEXT_PUBLIC_API_URL } = process.env;

const exampleAction: Action = {
  title: 'Scen på',
  topic: 'light_mixer/code/run',
  msg: 'scene_on',
};

const newPile: Pile = {
  _id: 'new',
  name: 'New Pile',
  actions: [exampleAction]
}

export default function Create() {

  return (
    <EditPile pile={[exampleAction]} />
  )
}
