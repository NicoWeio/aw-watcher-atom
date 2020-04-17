'use babel';

import AwWatcherAtomView from './aw-watcher-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  awWatcherAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.awWatcherAtomView = new AwWatcherAtomView(state.awWatcherAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.awWatcherAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'aw-watcher-atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.awWatcherAtomView.destroy();
  },

  serialize() {
    return {
      awWatcherAtomViewState: this.awWatcherAtomView.serialize()
    };
  },

  toggle() {
    console.log('AwWatcherAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
