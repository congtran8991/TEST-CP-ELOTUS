import { mutator } from 'satcheljs';
import { changeLanguage } from './actions';
import { getStore } from './store';

mutator(changeLanguage, (msg) => {
    getStore().currentLanguage = msg.lang;
});