import { Text, Title, Code, Divider } from '@mantine/core';
export default function HelpPage() {
  return (
    <>
      <Title order={1}>crAp 101</Title>
      Din mamma
      <Divider my={20} />
      <Title order={2}>Basic usage</Title>
      <Title order={3}>How to control</Title>
      <Text>
        Navigate to <Code>Collections</Code> and click the collection that suits your needs.
      </Text>
      <Text>Just press the buttons, ez.</Text>
      <Title order={3}>How to create a collection</Title>
      <Text>
        In <Code>Collections</Code>,
      </Text>
    </>
  );
}
