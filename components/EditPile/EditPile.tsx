import {
    ActionIcon, Button, Card, Checkbox,
    ColorInput, Container, DEFAULT_THEME, Divider,
    Group, Text, TextInput, Title
} from '@mantine/core';
import { useState } from 'react';
import { Plus, Trash } from 'tabler-icons-react';
import { Action, Pile } from '../../types/types';

interface Props {
    pile: Pile;
    setPileCallback: (name: string, actions: Action[], id: string) => void
}

function createAction(setActions: Function, actions: Action[]) {
    setActions([
        ...actions,
        {
            title: 'Scen på',
            topic: 'light_mixer/code/run',
            msg: 'scene_on',
        },
    ]);
}

function deleteAction(setActions: Function, actions: Action[], index: number) {
    let newActions = [...actions];
    if (index == 0) {
        newActions.shift();
        setActions(newActions);
    } else {
        newActions.splice(index, 1);
        setActions(newActions);
    }
}

type DBFields = 'title' | 'msg' | 'topic' | 'color';

function updateAction(setActions: Function, actions: Action[], value: string, index: number, field: DBFields) {
    let newActions = [...actions]; // copying the old datas array
    newActions[index][field] = value; // replace e.target.value with whatever you want to change it to

    setActions(newActions);
}

export default function EditPile({ pile, setPileCallback }: Props) {

    const [advanced, setAdvanced] = useState<boolean>(false);
    const [name, setName] = useState<string>(pile.name);
    const [actions, setActions] = useState<Action[]>(pile.actions);

    return (
        <Container size="sm">
            <Title order={1} mb={25}>
                Create new
            </Title>
            <TextInput
                label="Collection name"
                placeholder="Gasque"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Group mt="lg" spacing="xs" align="center" position="right">
                <Text size="sm" color="dimmed">
                    Advanced mode
                </Text>
                <Checkbox checked={advanced} onClick={() => setAdvanced(!advanced)} size="xs" />
            </Group>
            <Divider my="lg" />
            <Group mb="lg" position="apart">
                <Title order={2} sx={{ fontSize: 18 }}>
                    Actions
                </Title>
                <ActionIcon onClick={() => createAction(setActions, actions)} variant="filled" color="green">
                    <Plus size={18} />
                </ActionIcon>
            </Group>
            <Group grow direction="column">
                {actions.map((action, i) => (
                    <Card withBorder shadow="sm" key={i} mb="lg">
                        <Group position="right">
                            <ActionIcon onClick={() => deleteAction(setActions, actions, i)} color="red" variant="filled">
                                <Trash size={18} />
                            </ActionIcon>
                        </Group>
                        <TextInput
                            label="Label"
                            onChange={(e) => updateAction(setActions, actions, e.target.value, i, 'title')}
                            value={action.title}
                        />
                        {advanced && (
                            <TextInput
                                label="Topic"
                                onChange={(e) => updateAction(setActions, actions, e.target.value, i, 'topic')}
                                value={action.topic}
                            />
                        )}
                        <TextInput
                            label={advanced ? 'Message' : 'Script name'}
                            onChange={(e) => updateAction(setActions, actions, e.target.value, i, 'msg')}
                            value={action.msg}
                        />
                        <ColorInput
                            value={action.color}
                            placeholder="Pick color"
                            label="Script Color"
                            disallowInput
                            withPicker={false}
                            swatches={Object.entries(DEFAULT_THEME.colors).flatMap((key) => key[1])}
                            onChange={(color) => updateAction(setActions, actions, color, i, 'color')}
                        />
                    </Card>
                ))}
            </Group>
            <Button
                fullWidth
                color="green"
                variant="filled"
                leftIcon={<Plus />}
                onClick={() => setPileCallback(name, actions, pile._id)}
            >
                Create
            </Button>
        </Container>
    );
}
