import { helper } from '@ember/component/helper';
import createComponentCard from 'ember-mobiledoc-editor/utils/create-component-card';

export function mobiledocComponentCards() {
  return [
    createComponentCard('tools/editor/-cards/image'),
    createComponentCard('tools/editor/-cards/embedly')
  ];
}

export default helper(mobiledocComponentCards);
