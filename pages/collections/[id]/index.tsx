import { Button, Card, Group, SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ActionButton } from '../../../components/ActionButton/ActionButton';
import { Pile } from '../../../types/types';
import getClient from '../../../util/client';
import { getPiles } from '../../api';
import { getPile } from '../../api/[id]';

interface Props {
  pile: Pile;
}

export default function Collection({ pile }: Props) {
  const mqtt = getClient();
  const mobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
      <SimpleGrid cols={mobile ? 1 : 3}>
        {pile.actions.map((action, index) => (
          <ActionButton action={action} key={index} />
        ))}
      </SimpleGrid>
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
