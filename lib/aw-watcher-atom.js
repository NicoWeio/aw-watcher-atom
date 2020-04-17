'use babel';

import AwWatcherAtomView from './aw-watcher-atom-view';
import {
  CompositeDisposable
} from 'atom';

export default {
  activate(state) {
    console.warn("HEARTBEAT NOW ACTIVE");
    // setInterval(this.heartbeat.bind(this), 10000);

    atom.workspace.observeTextEditors((editor) => {
      var buffer;
      try {
        buffer = editor.getBuffer();
        buffer.onDidSave((e) => {
          console.warn("onDidSave", e);
          this.onEditorEvent(e, buffer);
        });
        buffer.onDidChange((e) => {
          console.warn("onDidChange", e);
          this.onEditorEvent(e, buffer);
        });
        editor.onDidChangeCursorPosition((e) => {
          console.warn("onDidChangeCursorPosition", e);
          this.onEditorEvent(e, buffer);
        });
      } catch (_error) {}
    });
  },

  onEditorEvent(editor, buffer) {
    try {
      console.log("onEditorEvent");
      let file = buffer.file;
      this.heartbeat({
        file: buffer.file ? buffer.file.path : 'unknown',
        grammar: buffer.languageMode.grammar.name,
        project: this.getProject() || 'unknown', //TODO testen
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
      return undefined; //TODO
    }
  },

  async heartbeat(data) {
    if (!this.cooldownOver) {
      console.log("Cooldown!");
      return;
    }
    this.cooldownOver = false;
    setTimeout(() => this.cooldownOver = true, 5000);

    console.log("HEARTBEAT!");
    let heartbeatData = {
      timestamp: new Date(),
      duration: 0,
      data,
    };

    let x = `http://localhost:5600/api/0/buckets/${this.BUCKET_ID}/heartbeat?pulsetime=${this.PULSETIME}`;
    console.log(x);
    const rawResponse = await fetch(x, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(heartbeatData)
    });

    if (rawResponse.status == 404) {
      console.warn(`Bucket ${this.BUCKET_ID} does not exist. Creating it now…`);
      await this.createBucket();
    }

    const content = await rawResponse.json();
    console.log(content);
  },

  async createBucket() {
    let bucket = {
      "client": "aw-watcher-atom", //_Nicolai-Laptop
      "type": "app.editor.activity",
      "hostname": "Nicolai-Laptop" //TODO
    };

    let x = `http://localhost:5600/api/0/buckets/${this.BUCKET_ID}`;
    console.log(x);
    const rawResponse = await fetch(x, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bucket)
    });
    const content = await rawResponse.json();

    console.log(content);
  },

  BUCKET_ID: 'aw-watcher-atom',
  PULSETIME: 60,
  cooldownOver: true,
};
