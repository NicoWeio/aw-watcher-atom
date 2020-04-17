'use babel';

import AwWatcherAtomView from './aw-watcher-atom-view';
import {
  CompositeDisposable
} from 'atom';

export default {
  activate(state) {
    this.hostname = require("os").hostname();

    atom.workspace.observeTextEditors((editor) => {
      try {
        let buffer = editor.getBuffer();
        buffer.onDidSave((e) => {
          this.onEditorEvent(e, buffer);
        });
        buffer.onDidChange((e) => {
          this.onEditorEvent(e, buffer);
        });
        editor.onDidChangeCursorPosition((e) => {
          this.onEditorEvent(e, buffer);
        });
      } catch (error) {
        console.warn(error);
      }
    });
  },

  onEditorEvent(editor, buffer) {
    try {
      let file = buffer.file;
      this.heartbeat({
        file: buffer.file ? buffer.file.path : 'unknown',
        grammar: buffer.languageMode.grammar.name,
        project: this.getProject() || 'unknown',
      });
    } catch (e) {
      console.error(e);
    }
  },

  getProject() {
    try {
      let pathArray = atom.project.getDirectories()[0].path.split('/')
      return pathArray[pathArray.length - 1];
    } catch (e) {
      return undefined;
    }
  },

  async heartbeat(data) {
    if (!this.cooldownOver) {
      return;
    }
    this.cooldownOver = false;
    setTimeout(() => this.cooldownOver = true, 5000);

    let heartbeatData = {
      timestamp: new Date(),
      duration: 0,
      data,
    };

    let url = `http://localhost:5600/api/0/buckets/${this.bucketId()}/heartbeat?pulsetime=${this.PULSETIME}`;
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(heartbeatData)
    });

    if (rawResponse.status == 404) {
      console.warn(`Bucket ${this.bucketId()} does not exist. Creating it now…`);
      await this.createBucket();
    }
  },

  async createBucket() {
    let bucket = {
      "client": this.bucketId(),
      "type": "app.editor.activity",
      "hostname": this.hostname || 'unknown'
    };

    let url = `http://localhost:5600/api/0/buckets/${this.bucketId()}`;
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bucket)
    });
  },

  bucketId() {
    return this.hostname ? ("aw-watcher-atom_" + this.hostname) : "aw-watcher-atom";
  },

  PULSETIME: 60,
  cooldownOver: true,
  hostname: null,
};
