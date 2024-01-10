import type { DayType, Season, CalendarEvent as CalendarEventEnum, WorkChart, TypeCalendarEvent } from "@/data/enums"

export interface RootState {
    version: string;
}

export interface CalendarState {
    months: ReadonlyArray<Month>,
    weekdays: ReadonlyArray<Weekday>,
    defaultEvents: Array<CalendarEvent>,
    customEvents: Array<CalendarEvent>,
    selectDates: Array<string>,
    workDates: WorkDay | null,
    current: Date,
}

export interface CalendarEventsState {
    isActive: CalendarEventEnum,
    limitDates: number,
}

export interface Month {
    season: Season,
    name: string,
}

export interface Weekday {
    name: string,
    fullName: string,
    value: number,
    isWeekend: boolean,
}

export interface CalendarEvent {
    id: number | string,
    name: string,
    description?: string,
    schemes: Array<string>,
    dates?: Array<string>,
    types: Array<EventType>,
    time?: {
        start: string,
        end: string,
    },
}

export interface EventType {
    name: TypeCalendarEvent,
    class: DayType,
}

export interface CalendarDay {
    name: string,
    isCurrent: boolean,
    isWeekend: boolean,
    eventCount?: number,
    classes: ReadonlyArray<string>,
}

export interface DayEvent {
    id: number | string,
    name: string,
    time?: {
        start: number,
        end: number
    },
    class?: string,
}

export interface WorkDay {
    start: string,
    schedule: WorkChart,
}

export interface MonthEventDay {
    days: Array<string>,
    name: string,
    time?: {
        start: number,
        end: number
    },
    row: number | undefined,
}
