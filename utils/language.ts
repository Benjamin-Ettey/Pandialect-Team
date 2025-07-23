export const LanguageCodes = {
    ja: 'JAPANESE',
    es: 'SPANISH',
    fr: 'FRENCH',
    de: 'GERMAN'
} as const;

export type LanguageCode = keyof typeof LanguageCodes;

export const getLanguageTitle = (code: LanguageCode) => {
    const titles = {
        ja: 'Japanese',
        es: 'Spanish',
        fr: 'French',
        de: 'German'
    };
    return titles[code] || 'English';
};

export const getAlphabetTitle = (code: LanguageCode) => {
    const titles = {
        ja: 'Hiragana',
        es: 'Alfabeto',
        fr: 'Alphabet',
        de: 'Alphabet'
    };
    return titles[code] || 'Alphabet';
};