const LESSON_IMAGES: Record<string, string> = {
    "greeting": "https://cdn-icons-png.flaticon.com/512/1973/1973807.png",
    "food": "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    "travel": "https://cdn-icons-png.flaticon.com/512/201/201623.png",
    "basics": "https://cdn-icons-png.flaticon.com/512/2936/2936886.png",
    "phrases": "https://cdn-icons-png.flaticon.com/512/1995/1995488.png",
    "numbers": "https://cdn-icons-png.flaticon.com/512/785/785116.png",
};

export const getLessonImage = (title: string): string => {
    const key = title.toLowerCase();
    return LESSON_IMAGES[key] || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
};