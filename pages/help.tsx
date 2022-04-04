import { List, Timeline, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { Plus } from 'tabler-icons-react';

export default function HelpPage() {
  return (
    <>
      <Timeline active={1} bulletSize={24} lineWidth={2}>
        <Timeline.Item bullet={<Plus size={18} />} title="Create collection">
          <Text color="dimmed" size="sm">
            Create a collection{' '}
            <Link href="/collections/create" passHref>
              <Anchor size={"sm"}>
                here
              </Anchor>
            </Link>.
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={'2'} title="Add actions to your collection">
          <Text color="dimmed" size="sm">
            An action consists of a label, a topic (advanced mode) and a message.
          </Text>
          <Text color="dimmed" size="sm">
            The label is the text that shows on the button and the message is the name of the script.
          </Text>
        </Timeline.Item>

        <Timeline.Item title="Pull request" bullet={'3'} lineVariant="dashed">
          <Text color="dimmed" size="sm">
            You&apos;ve submitted a pull request
            <Text variant="link" component="span" inherit>
              Fix incorrect notification message (#187)
            </Text>
          </Text>
        </Timeline.Item>

        <Timeline.Item title="Code review" bullet={'4'}>
          <Text color="dimmed" size="sm">
            <Text variant="link" component="span" inherit>
              Robert Gluesticker
            </Text>{' '}
            left a code review on your pull request
          </Text>
        </Timeline.Item>
      </Timeline>
    </>
  );
}
