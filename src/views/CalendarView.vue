<template>
    <main class="annual-calendar">
        <CalendarHeader
            :leftArrowClick="() => $router.replace(`${year - 1}`)"
            :rightArrowClick="() => $router.replace(`${year + 1}`)"
            :submit="() => $router.replace(($refs as any).year.value)">
            <input
                class="input-year"
                ref="year"
                type="text"
                pattern="\d{4}"
                v-model="checkYear"
                @focus="($refs as any).year.setSelectionRange(2, ($refs as any).year.value.length)">
        </CalendarHeader>

        <section class="calendar">
            <CalendarMonth
                v-for="(month, index) in calendar.months"
                :key="month"
                :year="year"
                :month="index"
                :isVisibleMonthDay="isVisibleMonthDay"
                :work-days="getAllWorkDates()[index]"
                :special-days="getSpecialDaysOnMonth(index)"/>
        </section>
    </main>
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';
    import { mapState } from 'vuex';
    import { WorkChart } from '@/data/enums';
    import type { CalendarEvent } from '@/vuex/types';
    import { convertDatesBySchemes, getDifferenceBetweenDates, getLastDayOfMonth, getNormalFormatMonthOrDay, getNormalMonth, groupBy } from '@/data/actions';
    import '@/assets/calendarView.css';


    export default defineComponent({
        data() {
            return {
                year: Number(this.$route.params.year),
                checkYear: Number(this.$route.params.year),
                isVisibleMonthDay: true,
            };
        },
        methods: {
            getAllWorkDates() {
                let workDays = [];
                let newYear = `${this.year}-1-1`;
                let start = getDifferenceBetweenDates(newYear, this.calendar.workDates?.start) % 4 + 1;
                for (let index = 0; index < 12; index++) {
                    let workDaysInMonth = this.getWorkDatesInMonth(start, index);
                    let lastDay = getLastDayOfMonth(this.year, index).getDate();
                    let offset = (this.calendar.workDates?.schedule === WorkChart.OneInThree) ? 4 : (this.calendar.workDates?.schedule === WorkChart.TwoInTwo) ? 3 : 0;
                    start = offset - (lastDay - workDaysInMonth[workDaysInMonth.length - 1]);
                    workDays.push(workDaysInMonth);
                }
                return workDays;
            },
            getWorkDatesInMonth(start: number, month: number) {
                let workDaysInMonth = [] as Array<number>;
                let lastDay = getLastDayOfMonth(this.year, month).getDate();
                for (let i = start; i < lastDay + 1; i+=4) {
                    workDaysInMonth.push(i);
                    (this.calendar.workDates.schedule === WorkChart.TwoInTwo) && workDaysInMonth.push(i + 1);
                }
                return workDaysInMonth;
            },
            getSpecialDaysOnMonth(month: number) {
                let date = `${this.year}-${getNormalFormatMonthOrDay(getNormalMonth(month))}`;
                return this.getSpecialDaysOnYear
                    .map(e => ({ ...e, dates: e.dates?.filter(i => i.startsWith(date)) }))
                    .filter(e => e.dates?.findIndex(i => i.startsWith(date)) !== -1)
                    .map((e, _, s) => ({
                        days: e.dates?.map(i => Number(i.slice(-2))),
                        info: Object.entries(groupBy(s
                            .map(i => ({name: i.name, dates: i.dates, classes: i.types.map(i => i.class)}))
                            .flatMap(i => i.dates?.map(x => ({ name: i.name, classes: i.classes, day: Number(x.slice(-2)) }))), 'day'))
                            .filter(i => e.dates?.map(i => Number(i.slice(-2))).includes(Number(i[0])))
                            .map((i: any) => ({ names: i[1].map((x: any) => x.name).join('\n'), classes: i[1].map((x: any) => x.classes).join(' ') })),
                    }))
                    .map(e => ({ days: e.info.map((_, i) => ({ day: e.days![i], info: e.info[i] })) }));
            },
        },
        computed: {
            ...mapState(['calendar']),
            getSpecialDaysOnYear() {
                return [...this.calendar.defaultEvents, ...this.calendar.customEvents]
                    .map(e => ({ ...e, dates: convertDatesBySchemes(e.schemes, this.year) })) as Array<CalendarEvent>;
            },
        },
        watch: {
            'calendar.workDates': function (nextValue) {
                this.isVisibleMonthDay = (nextValue === null);
            },
        },
        components: {
            CalendarHeader: defineAsyncComponent(() => import('@/components/common/CalendarHeader.vue')),
            CalendarMonth: defineAsyncComponent(() => import('@/components/year/CalendarMonth.vue')),
        },
    })
</script>

<style scoped>
    .annual-calendar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 10px 0;
    }

    .calendar {
        display: grid;
        grid-template-columns: repeat(var(--count-column), 1fr);
        grid-template-rows: repeat(var(--count-row), 1fr);
        gap: 10px;
        margin-bottom: 50px;
    }

    .input-year {
        width: var(--input-year-width);
        font-family: 'Times New Roman';
        font-size: var(--input-year-font-size);
        font-weight: bold;
        background-color: transparent;
        color: var(--page-color);
        padding: 0px 5px;
        border: none;
        text-align: center;
    }
</style>
