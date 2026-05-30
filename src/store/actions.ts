import { action } from 'satcheljs';

import type { Language } from '../i18n';

export const changeLanguage = action('CHANGE_LANGUAGE', (lang: Language) => ({ lang }));

export const initializeApplication = action('INITIALIZE_APPLICATION');