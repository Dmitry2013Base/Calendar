<template>
    <div class="month">
        <div
            :class="['month-name', calendar.months[month].season]"
            @click="() => $router.replace(`../${year}/${changeMonthByNameMonth(calendar.months[month].name)}`)">
            {{ calendar.months[month].name }}
        </div>
        <div class="day-list">
            <MonthDay
                v-for="weekday in calendar.weekdays"
                :key="weekday.name"
                :classes="['weekday', (weekday.isWeekend) && `weekend ${calendar.months[month].season}`]"
                :dayName="weekday.name"/>
            <MonthDay
                v-for="(day, index) in getMonth"
                :key="index"
                :title="day.title"
                :dayName="day.name"
                :classes="day.classes"
                :isVisible="isVisibleMonthDay ? 1 : day.classes.includes('work-day') ? 1 : 0.2"
                :isSelect="calendar.selectDates.includes(`${year}-${month + 1}-${day.name}`)"
                @click="changeSelectDate(day.name)"/>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';
    import { mapState, mapActions } from 'vuex';
    import { CalendarEvent, DayType } from "@/data/enums";
    import { getFirstDayOfMonth, getLastDayOfMonth, getNormalMonthNumber, getComputerWeekDay } from '@/data/actions';
    import type { CalendarDay, Weekday, Month } from '@/vuex/types';
    

    export default defineComponent({
        data() {
            return {
                days: [] as Array<CalendarDay>,
                monthNameColor: '',
            };
        },
        props: {
            year: {
                type: Number,
                required: true
            },
            month: {
                type: Number,
                required: true
            },
            isVisibleMonthDay: {
                type: Boolean,
                default: true
            },
            workDays: {
                type: Array,
                default: [] as Array<number>
            },
            specialDays: {
                type: Array,
                default: [] as Array<{days: Array<{day: number, info: {names: string, classes: string}}>}>
            },
        },
        methods: {
            ...mapActions({
                changeSelectDates: 'calendar/changeSelectDates',
            }),
            changeSelectDate(date: string) {
                if (this.calendarEvents.isActive !== CalendarEvent.None) {
                    this.changeSelectDates(`${this.year}-${getNormalMonthNumber(this.month)}-${date}`);
                }
            },
            changeMonthByNameMonth(name: string) {
                let index = this.calendar.months.findIndex((e: Month) => e.name === name) + 1;
                return (index === 0) ? '01' : (index < 10) ? `0${index}` : `${index}`;
            },
        },
        computed: {
            ...mapState(['calendar', 'calendarEvents']), 
            getMonth() {
                let year = this.year;
                let month = this.month;
                let weekday = getFirstDayOfMonth(year, month).getDay();

                const getDays = (day: number) => {
                    if (day !== 0) {
                        let specialDay = this.specialDays.find((e: any) => e.days.map((x: any) => x.day).includes(day)) as {days: Array<{day: number, info: {names: string, classes: string}}>};
                        let isWeekend = this.calendar.weekdays
                            .filter((x: Weekday) => x.isWeekend)
                            .map((x: Weekday) => getComputerWeekDay(x.value))
                            .includes(new Date(year, month, day).getDay());  
                        let isCurrent = (year === this.calendar.current.getFullYear() && month === this.calendar.current.getMonth() && day === this.calendar.current.getDate());
                        let isWorkDay = this.workDays.includes(day);
                        let titles = [], classes = [];

                        if (isWorkDay) { titles.push('Рабочий'); classes.push(`${DayType.WorkDay}`); }
                        if (isWeekend) { titles.push('Выходной'); classes.push(`${DayType.Weekend} ${this.calendar.months[month].season}`); }
                        if (isCurrent) { titles.push('Сегодня'); classes.push(DayType.CurrentDay); }

                        if (typeof(specialDay) !== 'undefined') {
                            let date = specialDay.days.find(e => e.day === day);
                            return {
                                name: `${day}`,
                                title: [...titles, date?.info.names].join('\n'),
                                classes: [...classes, date?.info.classes],
                            };
                        }
                        return {
                            name: `${day}`,
                            title: titles.join('\n'),
                            classes,
                        };
                    }
                    return { name: '', title: '', classes: [DayType.Empty] };
                }
                return [
                    ...Array((weekday === 0) ? 6 : weekday - 1).fill(-1),
                    ...Array(getLastDayOfMonth(year, month).getDate()).keys()
                ].map(e => getDays(e + 1));
            },
        },
        components: {
            MonthDay: defineAsyncComponent(() => import('@/components/year/MonthDay.vue')),
        }
    })
</script>

<style scoped>
    .month {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 5px;
        border: 1px solid var(--page-color);
        border-radius: 10px;
    }

    .month-name {
        width: fit-content;
        font-size: var(--font-size-month-name);
        font-weight: bold;
        text-align: center;
        margin: var(--month-name-margin);
        color: var(--page-color);
        color: v-bind(monthNameColor);
        cursor: pointer;
    }

    .month-name:hover {
        text-decoration: underline;
    }

    .month-name.summer {
        color: var(--summer-color);
    }

    .month-name.winter {
        color: var(--winter-color);
    }
    
    .month-name.autumn {
        color: var(--autumn-color);
    }

    .month-name.spring {
        color: var(--spring-color);
    }
    
    .day-list {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(7, 1fr);
        aspect-ratio: 1 / 1;
    }
</style>
