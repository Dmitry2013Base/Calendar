import { DayType, Season, TypeCalendarEvent } from "@/data/enums";
import type { CalendarEvent, Month, Weekday } from "@/vuex/types";


export const current = new Date();

export const months = [
    {
        name: 'Январь',
        season: Season.Winter,
    },
    {
        name: 'Февраль',
        season: Season.Winter,
    },
    {
        name: 'Март',
        season: Season.Spring,
    },
    {
        name: 'Апрель',
        season: Season.Spring,
    },
    {
        name: 'Май',
        season: Season.Spring,
    },
    {
        name: 'Июнь',
        season: Season.Summer,
    },
    {
        name: 'Июль',
        season: Season.Summer,
    },
    {
        name: 'Август',
        season: Season.Summer,
    },
    {
        name: 'Сентябрь',
        season: Season.Autumn,
    },
    {
        name: 'Октябрь',
        season: Season.Autumn,
    },
    {
        name: 'Ноябрь',
        season: Season.Autumn,
    },
    {
        name: 'Декабрь',
        season: Season.Winter,
    },
] as Array<Month>

export const weekdays = [
    {
        name: 'Пн',
        fullName: 'Понедельник',
        value: 1,
        isWeekend: false,
    },
    {
        name: 'Вт',
        fullName: 'Вторник',
        value: 2,
        isWeekend: false,
    },
    {
        name: 'Ср',
        fullName: 'Среда',
        value: 3,
        isWeekend: false,
    },
    {
        name: 'Чт',
        fullName: 'Четверг',
        value: 4,
        isWeekend: false,
    },
    {
        name: 'Пт',
        fullName: 'Пятница',
        value: 5,
        isWeekend: false,
    },
    {
        name: 'Сб',
        fullName: 'Суббота',
        value: 6,
        isWeekend: true,
    },
    {
        name: 'Вс',
        fullName: 'Воскресенье',
        value: 7,
        isWeekend: true,
    },
] as Array<Weekday>

export const hours = [...Array.from({ length: 23 }, (_, i) => i + 1), 0]

export const defaultEvents = [
    {
        id: 1,
        name: 'Новый год',
        schemes: ['01-01'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
    {
        id: 2,
        name: 'Рождество Христово',
        schemes: ['01-07'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
    {
        id: 3,
        name: '23 Февраля',
        schemes: ['02-23'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
    {
        id: 4,
        name: '8 Марта',
        schemes: ['03-08'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
    {
        id: 5,
        name: 'Праздник весны и труда',
        schemes: ['05-01'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
    {
        id: 6,
        name: 'День Победы',
        schemes: ['05-09'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
    {
        id: 7,
        name: 'День России',
        schemes: ['06-12'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
    {
        id: 8,
        name: 'День народного единства',
        schemes: ['11-04'],
        types: [
            {
                name: TypeCalendarEvent.Holiday,
                class: DayType.Holiday,
            }
        ],
    },
] as Array<CalendarEvent>

let events = localStorage.getItem('customEvents');
export const customEvents = ((events === null) ? [] : JSON.parse(events)) as Array<CalendarEvent>
