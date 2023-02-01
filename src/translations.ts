import { get, writable } from 'svelte/store';

export const culture = writable<string>();

export function t<Key extends keyof typeof defaultTranslations>(key: Key) {
  const c = get(culture);

  if (!c) {
    return defaultTranslations[key];
  }

  const translation: string = translations[c][key] || defaultTranslations[key];

  return translation;
}

const defaultTranslations = {
  Remove: 'Remove',
  'Instant shipping': 'Instant shipping',
};

const translations: Record<string, Partial<typeof defaultTranslations>> = {
  'sv-SE': {
    Remove: 'Ta bort',
    'Instant shipping': 'Snabb leverans',
  },
};
