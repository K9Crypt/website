import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from '../locales/en.json';
import tr from '../locales/tr.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import ru from '../locales/ru.json';
import es from '../locales/es.json';

addMessages('en', en);
addMessages('tr', tr);
addMessages('de', de);
addMessages('fr', fr);
addMessages('ru', ru);
addMessages('es', es);

const storedLocale = typeof window !== 'undefined' ? localStorage.getItem('preferred-locale') : null;

init({
    fallbackLocale: 'en',
    initialLocale: storedLocale || getLocaleFromNavigator(),
});