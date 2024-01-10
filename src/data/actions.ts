import { RepeatMode } from "@/data/enums";

//#region string

/**
 * Random id 4 symbols
 */
export const getRandomId = () => (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);

/**
 * Months numbers from 1 by 12
 */
export const getNormalMonth = (month: number) => month + 1;

/**
 * Months numbers from 0 by 11
 */
export const getComputerMonth = (month: number) => month - 1;

/**
 * String format 2 symbols
 */
export const getNormalFormatMonthOrDay = (num: number) => (num < 10) ? `0${num}` : `${num}`;

/**
 * Format date yyyy-M-d -> yyyy-MM-dd
 */
export const getNormalDateFormat = (date: string, isChangeMonth = true) => {
    let array = date.split('-').map(e => Number(e));
    return `${array[0]}-${getNormalFormatMonthOrDay(isChangeMonth ? getNormalMonth(array[1]) : array[1])}-${getNormalFormatMonthOrDay(array[2])}`
}

/**
 * Format date yyyy-MM-dd -> yyyy-M-d
 */
export const getComputerDateFormat = (date: string) => date.split('-').map(e => Number(e)).join('-');

/**
 * First letter is uppercase
 */
export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Group array elements by property
 */
export const groupBy = (array: Array<any>, key: string) => array.reduce((rv, x) => { (rv[x[key]] = rv[x[key]] || []).push(x); return rv; }, {});

//#endregion

//#region date

/**
 * First day of month
 */
export const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1);

/**
 * Last day of month
 */
export const getLastDayOfMonth = (year: number, month: number) => new Date(year, month + 1, 0);

/**
 * Difference between the two dates
 */
export const getDifferenceBetweenDates = (first : string, second : string) => Math.round((new Date(second).valueOf() - new Date(first).valueOf()) / (1000 * 3600 * 24));

/**
 * Day number in week
 */
export const getNumberDayWeekInMonth = (date: string) => Math.ceil((new Date(date).getDate()) / 7);

/**
 * January - 1 month, etc
 */
export const getNormalMonthNumber = (month: number | string) => Number(month) + 1;

/**
 * January - 0 month, etc
 */
export const getComputerMonthNumber = (month: number | string) => Number(month) - 1;

/**
 * Sunday is 7th day
 */
export const getNormalWeekDay = (weekDay: number) => (weekDay === 0) ? 7 : weekDay;

/**
 * Sunday is 0th day
 */
export const getComputerWeekDay = (weekDay: number) => (weekDay === 7) ? 0 : weekDay;

/**
 * Local date format
 */
export const getLocaleDateString = (date: string) => new Date(date).toLocaleDateString();

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number) => new Date(date.valueOf() + (1000 * 24 * 3600 * days));

//#endregion

//#region logic

/**
 * convert schemes in dates 
 */
export const convertDatesBySchemes = (schemes: Array<string>, year?: number, month?: number) => {
    let dates = [] as Array<string>;
    schemes.forEach(scheme => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(scheme)) dates.push(scheme);
        else if (/^\d{2}-\d{2}$/.test(scheme)) dates.push(...getDatesFromRepeatModeEachYear(schemes, year));
        else if (/^-\d{4}-\d{2}-\d{2}$/.test(scheme)) dates.push(...getDatesFromRepeatModeEachMonth(schemes, year, month));
        else if (/^\d{4}-\d{2}-\d{2}\*\d?$/.test(scheme)) dates.push(...getDatesFromRepeatModeEachWeek(schemes, year, month));
        else if (/^\d{4}-\d{2}-\(\d\*\d\)$/.test(scheme)) dates.push(...getDatesFromRepeatModeRelative(schemes, year, month));
        else if (/^\*\d{4}-\d{2}-\d{2}\*$/.test(scheme)) return dates.push(...getDatesFromRepeatModeEveryDay(schemes, year, month));
    });
    return dates;
}

/**
 * convert dates in schemes
 */
export const convertDatesByRepeatMode = (dates: Array<string>, mode: string) => {
    let countWeek = '1';
    let weekMode = mode.slice(0, -2);
    if (weekMode === RepeatMode.EachWeekNumber) {
        countWeek = mode.slice(-1);
        mode = weekMode;
    }
    switch (mode) {
        case RepeatMode.Once: return dates;
        case RepeatMode.EachYear: return dates.map(date => date.split('-').filter(e => e.length === 2).join('-'));
        case RepeatMode.EachMonth: return dates.map(date => `-${date}`);
        case RepeatMode.EachWeekNumber: return dates.map(date => `${date}*${countWeek}`);
        case RepeatMode.Relative: return dates.map(date => `${date.slice(0, -3)}-(${getNormalWeekDay(new Date(date).getDay())}*${getNumberDayWeekInMonth(`${date}`)})`);
        case RepeatMode.EveryDay: return dates.map(date => `*${date}*`);
        default: return [];
    }
}

const getDatesFromRepeatModeEachYear = (dates: Array<string>, year?: number) => (year) ? dates.map(date => `${year}-${date}`) : [];

const getDatesFromRepeatModeEachMonth = (dates: Array<string>, year?: number, month?: number) => {
    let result = [] as Array<string>;
    dates.forEach(date => {
        let params = date.slice(1).split('-');
        let startYear = Number(params[0]);

        if (year) {  
            let startMonth = getComputerMonth(Number(params[1]))
            if (month) {
                if (month >= startMonth) result.push(getNormalDateFormat(`${year}-${getComputerMonth(month)}-${date.slice(-2)}`));
            } else {
                startMonth = (year > startYear) ? 0 : (year < startYear) ? 13 : startMonth;
                result.push(...Array.from({length: 12}, (_, i) => i + 1)
                    .filter(e => e > startMonth)
                    .flatMap((x: number) => dates.flatMap(e => getNormalDateFormat(`${year}-${getComputerMonth(x)}-${e.slice(-2)}`))));
            }
        }
    });
    return result;
}

const getDatesFromRepeatModeEachWeek = (dates: Array<string>, year?: number, month?: number) => {
    let newDates = [] as Array<string>;
    const getFirstDayByWeekday = (startDate: string, weekday: number) => {
        let current = startDate.split('-');
        let year = Number(current[0]);
        let month = getComputerMonth(Number(current[1]));
        let firstDay = getFirstDayOfMonth(year, month);
        let day = getNormalWeekDay(firstDay.getDay());
        let result = addDays(firstDay, -1 * (day - weekday) + ((day > weekday) ? 7 : 0));
        return getNormalDateFormat(`${result.getFullYear()}-${result.getMonth()}-${result.getDate()}`);
    }

    dates.forEach(item => {
        let params = item.split('*');
        let interval = Number(params[1]);
        interval = (interval === 0) ? 1 : interval;
        let array = params[0].split('-');
        let startYear = Number(array[0]), startMonth = Number(array[1]), startDay = Number(array[2]);
        let currentYear = startYear, currentMonth = startMonth, currentDay = startDay;
        let startDate = '', endDate = '';

        if (startYear < currentYear) {
            startDate = getFirstDayByWeekday(`${currentYear}-01`, getNormalWeekDay(new Date(`${startYear}-${startMonth}-${startDay}`).getDay()));
        } else if (startYear === currentYear) {
            startDate = getNormalDateFormat(`${startYear}-${startMonth - 1}-${startDay}`);
        }

        if (year) {
            endDate = `${year}-12-31`;
            if (year > startYear) {  
                startDate = getFirstDayByWeekday(`${year}-01`, getNormalWeekDay(new Date(startDate).getDay()));
            }

            if (month) {
                let lastDay = getLastDayOfMonth(year, getComputerMonth(month));
                endDate = `${year}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`;

                if (year > startYear) {
                    startDate = getFirstDayByWeekday(`${year}-${month}`, getNormalWeekDay(new Date(startDate).getDay()));
                } else if (year === startYear) {
                    if (month > startMonth) {
                        startDate = getFirstDayByWeekday(`${year}-${month}`, getNormalWeekDay(new Date(startDate).getDay()));
                    } else if (month === startMonth) {
                        startDate = startDate;
                    }
                }
            }
        } else {
            endDate = `${startYear}-12-31`;
        }

        let date = startDate;
        while (new Date(date).valueOf() <= new Date(endDate).valueOf()) {
            let day = addDays(new Date(date), 7 * interval);
            newDates.push(date);
            currentYear = day.getFullYear();
            currentMonth = day.getMonth();
            currentDay = day.getDate();
            date = getNormalDateFormat(`${currentYear}-${currentMonth}-${currentDay}`);
        }
    });

    return newDates;
};

const getDatesFromRepeatModeEveryDay = (dates: Array<string>, year?: number, month?: number) => {
    let result = [] as Array<string>;
    dates.forEach(date => {
        let start = date.slice(1, -1).split('-');
        let startYear = Number(start[0]), startMonth = Number(start[1]), startDay = Number(start[2]);
        let startDate = ``, endDate = ``;

        if (year) {
            if (year === startYear) {
                if (month) {
                    if (month === startMonth) {
                        startDate = `${startYear}-${startMonth}-${startDay}`;
                    } else if (month > startMonth) {
                        startDate = `${year}-${month}-01`;
                    }
                    endDate = `${year}-${month}-${getLastDayOfMonth(year, month - 1).getDate()}`;
                } else {
                    startDate = `${startYear}-${startMonth}-${startDay}`;
                    endDate = `${startYear}-12-31`;
                }
            } else if (year > startYear) {
                if (month) {
                    startDate = `${year}-${month}-01`;
                    endDate = `${year}-${month}-${getLastDayOfMonth(year, month - 1).getDate()}`;
                } else {
                    startDate = `${year}-01-01`;
                    endDate = `${year}-12-31`;
                }
            }
        } else {
            startDate = `${startYear}-${startMonth}-${startDay}`;
            endDate = `${startYear}-12-31`;
        }

        let firstDate = new Date(startDate);
        while (firstDate.valueOf() <= new Date(endDate).valueOf()) {
            result.push(getNormalDateFormat(`${firstDate.getFullYear()}-${firstDate.getMonth()}-${firstDate.getDate()}`));
            firstDate = addDays(firstDate, 1);
        }
    });

    return result;
}

const getDatesFromRepeatModeRelative = (dates: Array<string>, year?: number, month?: number) => {
    return dates
        .filter(date => month ? date.split('-')[1].includes(`${month}`) : date)
        .map(date => {
            let currentDate = date.split('-');
            let startYear = Number(currentDate[0]), startMonth = getComputerMonth(Number(currentDate[1])), coefficients = currentDate[2].match(/\d/g)?.map(e => Number(e));
            let currentYear = (year) ? year : startYear;
            if (!coefficients || currentYear < startYear) return '';
        
            let weekdayFirstDay = getFirstDayOfMonth(currentYear, startMonth).getDay();
            let day = 7 * (coefficients[1]) - (7 - (coefficients[0] - (weekdayFirstDay - 1)));
            day = (day + 7 - 7 * (coefficients[1]) < 1) ? day + 7 : day;
            day = (weekdayFirstDay === 0 && day === 7 * coefficients[1] + 1) ? day - 7 : day;
            day = (day > getLastDayOfMonth(currentYear, startMonth).getDate()) ? (day - 7) : day;
            return getNormalDateFormat(`${currentYear}-${startMonth}-${day}`);
        }).filter(e => e !== '');
}

//#endregion
