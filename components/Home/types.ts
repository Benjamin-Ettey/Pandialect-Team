export type Lesson = {
    id: string;
    title: string;
    xpReward: number;
    route: string;
    image: string;
};

export type Language = {
    name: string;
    flag: string;
    code: string;
};

export type Level = {
    name: string;
    code: string;
};

export const LANGUAGES: Language[] = [
    { name: 'Spanish', flag: '🇪🇸', code: 'es' },
    { name: 'French', flag: '🇫🇷', code: 'fr' },
    { name: 'German', flag: '🇩🇪', code: 'de' },
    { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
];

export const LEVELS: Level[] = [
    { name: 'Beginner', code: 'beginner' },
    { name: 'Intermediate', code: 'intermediate' },
    { name: 'Advanced', code: 'advanced' },
];