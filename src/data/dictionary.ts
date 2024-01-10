const dictionary = [
    { word: 'Первый', genders: ['ый', 'ая', 'ое'] },
    { word: 'Второй', genders: ['ой', 'ая', 'ое'] },
    { word: 'Третий', genders: ['ий', 'ья', 'ье'] },
    { word: 'Четвертый', genders: ['ый', 'ая', 'ое'] },
    { word: 'Последний', genders: ['ий', 'яя', 'ее'] },
    { word: 'Каждый', genders: ['ый', 'ая', 'ое'] },
    { word: 'Понедельник', gender: 0 },
    { word: 'Вторник', gender: 0 },
    { word: 'Среда', gender: 1 },
    { word: 'Четверг', gender: 0 },
    { word: 'Пятница', gender: 1 },
    { word: 'Суббота', gender: 1 },
    { word: 'Воскресенье', gender: 2 },
]

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getGender = (str: string, gender: number = 0) => {
    let item = dictionary.find(e => (e.word.toLowerCase() === str.toLowerCase() && e.genders));
    if (typeof(item) === 'undefined') return str.toLowerCase();
    return item?.word.replace(new RegExp(`[\\w\\W]{${item?.genders![gender]?.length}}$`, 'g'), item?.genders![gender]).toLowerCase();
}

export const getPhraseGender = (str: string) => {
    let words = str.split(' ');
    let item = words.map(x => dictionary.find(e => e.word.toLowerCase() === x.toLowerCase())).find(e => typeof(e?.gender) !== 'undefined');
    if (typeof(item) === 'undefined') return str.toLowerCase();
    return words.map(e => getGender(e, item?.gender)).join(' ');
}
