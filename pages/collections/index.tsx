import { Button, Box, Group } from '@mantine/core';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Pile } from '../../types/types';
import { getPiles } from '../api';

interface Props {
  piles: Pile[];
}

export default function Collections(props: Props) {
  return (
    <>
      <Group>
        {props.piles.map((pile) => (
          <Box key={pile._id}>
            <Link href={`/collections/${pile._id}`} passHref>
              <Button key={pile._id}>{pile.name}</Button>
            </Link>
          </Box>
        ))}
      </Group>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const data = await getPiles();
  return {
    props: {
      piles: data!,
    },
    revalidate: 10,
  };
};
