export enum Season {
    Summer = 'summer',
    Winter = 'winter',
    Autumn = 'autumn',
    Spring = 'spring',
}

export enum DayType {
    Empty = 'empty',
    Weekend = 'weekend',
    WorkDay = 'work-day',
    Holiday = 'holiday',
    CurrentDay = 'current-day',
    SelectDay = 'select-day',
    Custom = 'custom',
    Other = 'other',
}

export enum WeekNumber {
    First = 1,
    Second,
    Third,
    Fourth,
    Last,
};

export enum RepeatMode {
    Once = 'Один раз',
    EachYear = 'Каждый год',
    EachMonth = 'Каждый месяц',
    EachWeekNumber = 'Каждую неделю',
    EveryDay = 'Каждый день',
    Relative = 'Каждую n-неделю',
    None = '',
}

export enum TypeCalendarEvent {
    Custom = 'Свое',
    Holiday = 'Праздник',
    Weekend = 'Выходной',
    WorkDay = 'Рабочий день',
}

export enum CalendarEvent {
    None,
    Event,
    Difference,
    Work,
}

export enum WorkChart {
    OneInThree = 'Сутки через трое',
    TwoInTwo = 'Два через два',
}

export enum DayEventPosition {
    Start = 'start',
    Center = 'center',
    End = 'end',
    One = 'one',
    Empty = 'empty',
}
