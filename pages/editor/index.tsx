import {
  Button,
  Group,
  Header,
  Input,
  Kbd,
  Modal,
  Select,
  Space,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { MqttClient, OnMessageCallback } from 'mqtt';
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import getClient from '../../util/client';
import Editor from '@monaco-editor/react';

interface Props {}

type Script = {
  name: string;
  source: string;
};

const scripts: Script[] = [];

function connectToMQTT(scriptsLoaded: () => void) {
  console.log('connectToMQTT');

  const callback: OnMessageCallback = (topic, payload) => {
    // console.log('got message:', topic, payload.toString())
    if (topic.search('light_mixer/code/scripts/') == 0) {
      let name = topic.split('light_mixer/code/scripts/')[1];
      scripts.push({ name, source: payload.toString() });
    }
    if (topic.search('light_mixer/extra') == 0) {
      // all scripts loaded
      scripts.sort((aa, bb) => {
        const a = aa.name.toLowerCase();
        const b = bb.name.toLowerCase();
        return a > b ? 1 : b > a ? -1 : 0;
      });
      scriptsLoaded();
    }
  };

  const mqtt = getClient();

  mqtt.on('message', callback);

  mqtt.subscribe('light_mixer/#', (data) => {
    console.log('subscribe', data);
  });

  return {
    connection: mqtt,
    dismount: () => {
      mqtt.off('message', callback);
    },
  };
}

function computeSelectableData(data: Script[]) {
  return data.map((script) => {
    return {
      value: script.name,
      label: script.name,
    };
  });
}

export default function ScriptEditor(props: Props) {
  console.log('rerender');

  // const [scriptsLoaded, setScriptsLoaded] = useState<boolean>((scripts.length && true) || false);
  const [selectedScriptName, setSelectedScriptName] = useState<string>('');
  const [opened, setOpened] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const { _, dismount } = connectToMQTT(() => setSelectedScriptName(scripts[0].name));
    if (scripts.length > 0) console.log(scripts);
    return dismount;
  }, []);

  function handleEditorDidMount(editor: any, monaco: any) {
    console.log(editor);
    editorRef.current = editor;
  }

  function changeScript(name: string | null) {
    console.log(name);
    setSelectedScriptName(name || '');
  }

  function newScript() {
    setOpened(true);
  }

  function saveScript(name: string | undefined, value: string | undefined) {
    const mqtt = getClient();
    if (!name) {
      return;
    }
    console.log('Saved new script: ' + name);
    setOpened(false);
    setSelectedScriptName(name);
    mqtt.publish(`light_mixer/code/scripts/${selectedScriptName}`, String(value));
  }

  const handleKeyPress = useCallback(
    (event) => {
      if (event.ctrlKey === true) {
        if (event.key === 'Enter') {
          runScript();
        }
      }
    },
    [selectedScriptName]
  );

  function runScript() {
    const mqtt = getClient();
    mqtt.publish('light_mixer/code/run', `${selectedScriptName}:start()`);
    mqtt.publish(`light_mixer/code/scripts/${selectedScriptName}`, editorRef?.current?.getValue());
  }

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="New Script, lessgooooo!">
        <Group>
          <Title order={3}>What should the new script be called?</Title>
        </Group>
        <Space h="md" />
        <Group>
          <TextInput placeholder="ex: banger_script_v3.14" ref={inputRef} />
          <Button
            onClick={() => saveScript(inputRef.current?.value, editorRef.current?.getValue())}
          >
            Save
          </Button>
        </Group>
      </Modal>
      <Group>
        <Title order={3}>{selectedScriptName}</Title>
        <Select
          value={selectedScriptName}
          onChange={(name: string | null) => changeScript(name)}
          data={computeSelectableData(scripts)}
          searchable
          maxDropdownHeight={500}
        />
        <Tooltip
          label={
            <>
              <Kbd>Ctrl</Kbd> + <Kbd>N</Kbd>
            </>
          }
        >
          <Button onClick={newScript}>New</Button>
        </Tooltip>
        <Tooltip
          label={
            <>
              <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
            </>
          }
        >
          <Button onClick={runScript}>Run</Button>
        </Tooltip>
      </Group>
      <Space h="md" />
      <Group>
        <Editor
          height="60vh"
          defaultLanguage="lua"
          defaultValue={"-- let's code an epic light show"}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          value={scripts.find((s) => s.name === selectedScriptName)?.source}
        />
      </Group>
    </>
  );
}
