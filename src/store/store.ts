import { createStore } from 'satcheljs';
import type { Language } from '../i18n';

export interface AppState {
  currentLanguage: Language;
}

// Initial State definition
const initialState: AppState = {
  currentLanguage: 'vi'
};

// Create and export the store
export const getStore = createStore<AppState>('AppStore', initialState);

export default getStore;
