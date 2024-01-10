<template>
    <div class="month">
        <MonthDay
            v-for="weekday in calendar.weekdays"
            :key="weekday.name"
            :classes="['weekday', 'large']"
            :day-name="weekday.fullName"/>
        <MonthDay
            v-for="weekday in calendar.weekdays"
            :key="weekday.name"
            :classes="['weekday', 'small']"
            :day-name="weekday.name"/>
        <MonthDay
            v-for="(day, index) in getMonthDays"
            :key="index"
            :day-name="day.name"
            :classes="[...day.classes]"
            :isSelectDay="calendar.selectDates.includes(`${year}-${month + 1}-${day.name}`)"
            :events-count="day.eventCount"
            @changeDay="(date, flag) => changeSelectDate(date, flag)"/>
        </div>
</template>
    
<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';
    import { mapState, mapActions } from 'vuex';
    import { getFirstDayOfMonth, getLastDayOfMonth, getNormalMonthNumber, getNormalWeekDay, getComputerWeekDay, getNormalFormatMonthOrDay, getNormalMonth } from "@/data/actions";
    import { CalendarEvent, DayType } from '@/data/enums';
    import type { CalendarDay, Weekday } from '@/vuex/types';


    export default defineComponent ({
        data() {
            return {
                rows: 5,
            }
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
            events: {
                type: Array,
                default: []
            }
        },
        methods: {
            ...mapActions({
                changeSelectDates: 'calendar/changeSelectDates',
                changeActiveEvent: 'calendarEvents/changeActiveEvent',
            }),
            changeSelectDate(date: string, flag: boolean) {
                if (flag) this.changeActiveEvent(CalendarEvent.Event);
                if (this.calendarEvents.isActive === CalendarEvent.None) {
                    this.$router.replace(`../${this.year}/${getNormalFormatMonthOrDay(getNormalMonth(this.month))}/${getNormalFormatMonthOrDay(Number(date))}`);
                } else {
                    this.changeSelectDates(`${this.year}-${getNormalMonthNumber(this.month)}-${date}`);
                }
            },
        },
        computed: {
            ...mapState(['calendar', 'calendarEvents']),
            getMonthDays() {
                let year = this.year;
                let month = this.month;
                let firstDay = getFirstDayOfMonth(year, month);
                let lastDay = getLastDayOfMonth(year, month);
                let lastDayLastMonth = getLastDayOfMonth(year, month - 1).getDate();
                let count = getNormalWeekDay(firstDay.getDay()) - 1;

                let days = [
                    ...Array.from({length: count}, (_, i) => ({ name: `${lastDayLastMonth - i}`, isOther: true })).reverse(),
                    ...Array.from({length: lastDay.getDate()}, (_, i) => ({name: `${i + 1}`, isOther: false })),
                    ...Array.from({length: 7 - getNormalWeekDay(lastDay.getDay())}, (_, i) => ({ name: `${i + 1}`, isOther: true })),
                ].map(day => (!day.isOther) ? {
                    name: day.name,
                    isCurrent: (year === this.calendar.current.getFullYear() && month === this.calendar.current.getMonth() && Number(day.name) === this.calendar.current.getDate()),
                    isWeekend: [
                        ...this.calendar.weekdays.filter((x: Weekday) => x.isWeekend).map((x: Weekday) => getComputerWeekDay(x.value))
                    ].includes(new Date(year, month, Number(day.name)).getDay()),
                    eventCount: this.events.filter((e: any) => e.days.includes(day.name)).length,
                    get classes() {
                        let classes: Array<string> = [];
                        (this.isCurrent) && classes.push(DayType.CurrentDay);
                        (this.isWeekend) && classes.push(DayType.Weekend);
                        return classes;
                    },
                }
                : { name: day.name, isCurrent: false, isWeekend: false, get classes() { return [DayType.Other] } });
                this.rows = Math.ceil(days.length / 7);
                return days as Array<CalendarDay>;
            },
        },
        components: {
            MonthDay: defineAsyncComponent(() => import('@/components/month/MonthDay.vue')),
            EventForm: defineAsyncComponent(() => import('@/components/common/EventForm.vue')),
        }
    })
</script>
      
<style scoped>
    .month {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: auto repeat(v-bind(rows), auto);
        gap: 1px;
        margin-bottom: 50px;
        border: 1px solid var(--page-color);
        border-radius: 10px;
        overflow: hidden;
    }
</style>
      