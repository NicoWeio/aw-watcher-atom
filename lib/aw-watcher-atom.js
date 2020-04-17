'use babel';

import AwWatcherAtomView from './aw-watcher-atom-view';
import {
  CompositeDisposable
} from 'atom';

export default {
  activate(state) {
    console.warn("HEARTBEAT NOW ACTIVE");
    setInterval(this.heartbeat.bind(this), 10000);
  },

  getFile() {
    try {
      let editor = atom.workspace.getActivePaneItem();
      return editor.buffer.file.path;
    } catch (e) {
      return undefined; //TODO
    }
  },

  getLanguage() {
    try {
      let editor = atom.workspace.getActivePaneItem();
      return editor.languageMode.grammar.name;
    } catch (e) {
      return undefined; //TODO
    }
  },

  getProject() {
    try {
      let pathArray = atom.project.getDirectories()[0].realPath.split('/')
      return pathArray[pathArray.length - 1];
    } catch (e) {
      return undefined; //TODO
    }
  },

  async heartbeat() {
    console.log("HEARTBEAT!");

    let heartbeatData = {
      timestamp: new Date(),
      duration: 0,
      data: {
        file: this.getFile() || 'unknown',
        language: this.getLanguage() || 'unknown',
        project: this.getProject() || 'unknown',
      }
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
  PULSETIME: 20,

};
