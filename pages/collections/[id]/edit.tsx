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
import getConfig from 'next/config';
import { showNotification } from '@mantine/notifications';
import Router from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Action, Pile } from '../../../types/types';
import { getPiles } from '../../api';
import { getPile } from '../../api/[id]';
import EditPile from '../../../components/EditPile/EditPile';

interface Props {
  pile: Pile;
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
