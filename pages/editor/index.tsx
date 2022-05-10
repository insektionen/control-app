import { Group, Text, Title } from '@mantine/core';
import { OnMessageCallback } from 'mqtt';
import { useEffect, useState } from 'react';
import getClient from '../../util/client';

interface Props {
  
}

type Script = {
  name: string;
  source: string;
}

const scripts: Script[] = [];
export default function Editor(props: Props) {
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>((scripts.length && true) || false);
  
  useEffect(() => {
    const mqtt = getClient();

    const callback: OnMessageCallback = (topic, payload) => {
      // console.log('got message:', topic, payload.toString())
      if (topic.search('light_mixer/code/scripts/') == 0) {
        let name = topic.split('light_mixer/code/scripts/')[1];
        scripts.push({name, source: payload.toString()});
      }
      if (topic.search('light_mixer/extra') == 0) {
        scripts.sort((aa,bb) => {
          const a = aa.name.toLowerCase();
          const b = bb.name.toLowerCase()
          return (a > b) ? 1 : ((b > a) ? -1 : 0)
        });
        setScriptsLoaded(true);
      }
    }
    
    mqtt.on('message', callback);
    
    mqtt.subscribe("light_mixer/#", (data) => {
      console.log("subscribe", data);
    });

    return () => {
      mqtt.off('message', callback)
    }
  }, [])

  console.log(scripts);
  
  return (
    <>
      <Group position="apart">
        <Title order={1} mb="lg">
          Editor
        </Title>
      </Group>
      <Group grow direction="column">
        {
          scripts.map((script) => (
            <Text key={script.name}>{script.name}</Text>
          ))
        }
      </Group>
    </>
  );
}

// export const getStaticProps: GetStaticProps<Props> = async (context) => {
  
//   return {
//     props: {
//       piles: data!,
//     },
//     revalidate: 1,
//   };
// };
