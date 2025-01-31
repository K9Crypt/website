import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from '../locales/en.json';
import tr from '../locales/tr.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';

addMessages('en', en);
addMessages('tr', tr);
addMessages('de', de);
addMessages('fr', fr)

const storedLocale = typeof window !== 'undefined' ? localStorage.getItem('preferred-locale') : null;

init({
    fallbackLocale: 'en',
    initialLocale: storedLocale || getLocaleFromNavigator(),
});