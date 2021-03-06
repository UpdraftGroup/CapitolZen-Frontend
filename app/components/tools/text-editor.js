import { set, get, computed } from '@ember/object';
import Component from '@ember/component';
import { EKMixin, keyDown } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { BLANK_DOC, CARDS } from '../../utils/doc-factory';
import createComponentCard from 'ember-mobiledoc-editor/utils/create-component-card';
import { assert } from '@ember/debug';
import $ from 'jquery';

export default Component.extend(EKMixin, {
  classNameBindings: ['disabled'],
  showEditor: true,
  autoSave: false,
  editor: false,
  content: null,
  options: null,

  init() {
    this._super(...arguments);
    if (!this.content) {
      this.set('content', BLANK_DOC);
    }
  },

  activateKeyboard: on('init', function() {
    set(this, 'keyboardActivated', true);
  }),

  cardList: computed('context', function() {
    return this.getWithDefault('context.cardList', CARDS);
  }),

  cardComponentList: computed('cardList', function() {
    return this.get('cardList').map(card => {
      return createComponentCard(card);
    });
  }),

  saveKey: on(keyDown('Enter+cmd'), function(event) {
    event.preventDefault();
    this.save();
  }),
  escapeKey: on(keyDown('Escape'), function() {
    if (!get(this, 'isNew')) {
      this.cancel();
    }
  }),
  save() {
    let doc = get(this, 'doc');
    let args = { doc: doc };
    if (get(this, 'docId')) {
      args.docId = get(this, 'docId');
    }
    get(this, 'saveAction')(args);
    if (!get(this, 'autoSave')) {
      run(() => {
        $('.mobiledoc-editor__editor').empty();
      });
    }
  },
  cancel() {
    get(this, 'cancelAction')();
  },
  delete() {
    let args = { docId: get(this, 'docId') };
    get(this, 'deleteAction')(args);
    this.destroy();
  },

  insertSection() {
    this.editor.run(postEditor => {
      let newSection = postEditor.builder.createMarkupSection('p');
      postEditor.insertSectionAtEnd(newSection);
      postEditor.setRange(newSection.tailPosition());
    });
  },

  actions: {
    mobileDocUpdated(doc) {
      set(this, 'doc', doc);
      if (get(this, 'autoSave')) {
        this.save();
      }
    },
    didCreateEditor(editor) {
      this.set('editor', editor);
    },
    addCard(cardName, payload = {}) {
      assert(
        'Please provide a valid card name',
        this.get('cardList').includes(cardName)
      );
      //can't add default params here because actions send `null` rather than `undefined`
      if (!payload) {
        payload = {};
      }

      payload.editorContext = this.context;

      this.editor.insertCard(cardName, payload, true);
      this.insertSection();
    },
    saveDocument() {
      this.save();
    },
    cancelDocument() {
      this.cancel();
    },
    deleteDocument() {
      this.delete();
    },

    didSaveCard(/*props*/) {},

    focusEditor(event) {
      if (
        event.target.tagName === 'ARTICLE' &&
        event.target.classList.contains('mobiledoc-editor__editor-wrapper')
      ) {
        let { post } = this.editor;
        let range = post.toRange();
        this.editor.focus();
        event.preventDefault();
        this.editor.run(postEditor => {
          postEditor.setRange(range.tail.section.tailPosition());
        });
      }
    }
  }
});
