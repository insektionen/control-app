import { Button, Card, Group } from '@mantine/core';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Pile } from '../../../types/types';
import getClient from '../../../util/client';
import { getPiles } from '../../api';
import { getPile } from '../../api/[id]';

interface Props {
  pile: Pile;
}

export default function Collection({ pile }: Props) {
  const mqtt = getClient();

  return (
    <>
      <Group>
        {pile.actions.map((action, index) => (
          <Button onClick={() => mqtt.publish(action.topic, `${action.msg}:start()`)} key={index}>
            {action.title}
          </Button>
        ))}
      </Group>
    </>
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
