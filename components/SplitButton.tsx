import React from 'react';
import { createStyles, Button, Menu, Group, ActionIcon, MantineColor } from '@mantine/core';
import { Trash, Bookmark, Calendar, ChevronDown } from 'tabler-icons-react';

interface Props {
  label: string;
  menu: JSX.Element;
  onClick?: Function;
  color?: MantineColor;
}

const useStyles = createStyles((theme) => ({
  button: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  menuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
    borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
  },
}));

export function SplitButton({ label, menu, onClick, color = 'blue' }: Props) {
  const { classes } = useStyles();

  return (
    <Group noWrap spacing={0}>
      <Button
        color={color}
        onClick={() => (onClick !== undefined ? onClick() : '')}
        className={classes.button}
      >
        {label}
      </Button>
      <Menu
        control={
          <ActionIcon variant="filled" color={color} size={36} className={classes.menuControl}>
            <ChevronDown size={16} />
          </ActionIcon>
        }
        transition="pop"
        placement="end"
      >
        {menu}
      </Menu>
    </Group>
  );
}
