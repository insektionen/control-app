import { ActionIcon, Button, Card, Group, MantineColor, Menu } from '@mantine/core';
import { ChevronDown } from 'tabler-icons-react';

interface Props {
  label: string;
  onClick?: Function;
  color?: MantineColor;
  menu: JSX.Element;
}

export default function CollectionListItem({ label, onClick, color, menu }: Props) {
  return (
    <Card>
      <Group noWrap spacing={'lg'}>
        <Button
          variant="default"
          fullWidth
          color={color}
          onClick={() => (onClick !== undefined ? onClick() : '')}
        >
          {label}
        </Button>
        <Menu
          control={
            <ActionIcon variant="default" color={color} size={36}>
              <ChevronDown size={16} />
            </ActionIcon>
          }
          transition="pop"
          placement="end"
        >
          {menu}
        </Menu>
      </Group>
    </Card>
  );
}
