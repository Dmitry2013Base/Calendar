<template>
    <main class="month-view">
        <div class="month-content">
            <div class="month-header">
                <CalendarMonthYear v-if="lastDate.length" class="large" :year="Number(lastDate[0])" :month="Number(lastDate[1])"/>
                <CalendarHeader
                    :leftArrowClick="() => $router.replace(changeMonthByDirection(false))"
                    :rightArrowClick="() => $router.replace(changeMonthByDirection(true))"
                    :submit="() => $router.replace(changeMonthByNameMonth(($refs as any).month.value))">
                    <input
                        class="input-month"
                        ref="month"
                        type="text"
                        v-model="month"
                        v-input-helper="{ array: calendar.months.map((e: Month) => e.name) }"
                        @focus="($refs as any).month.setSelectionRange(0, ($refs as any).month.value.length)">
                </CalendarHeader>
                <CalendarMonthYear v-if="nextDate.length" class="large" :year="Number(nextDate[0])" :month="Number(nextDate[1])"/>
            </div>
            <CalendarMonth :year="Number(year)" :month="monthNumber" :events="getEvents"/>
        </div>
    </main>
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';
    import { mapState } from 'vuex';
    import type { Month, MonthEventDay } from '@/vuex/types';
    import { getComputerMonthNumber, getNormalMonthNumber, getNormalFormatMonthOrDay, convertDatesBySchemes } from "@/data/actions";
    import '@/assets/monthView.css';


    export default defineComponent({
        data() {
            return {
                year: this.$route.params.year,
                month: '',
                lastDate: [] as Array<number>,
                nextDate: [] as Array<number>,
                monthNumber: 0,
                events: [] as Array<MonthEventDay>,
            }
        },
        mounted() {
            this.updateDate();
            let month = getComputerMonthNumber(this.$route.params.month as string);
            let lastMonth = Number(this.changeMonthByDirection(false).slice(-2)), nextMonth = Number(this.changeMonthByDirection(true).slice(-2));
            this.lastDate = [Number((lastMonth > month) ? Number(this.year) - 1 : this.year), getComputerMonthNumber(lastMonth)];
            this.nextDate = [Number((nextMonth < month) ? Number(this.year) + 1 : this.year), getComputerMonthNumber(nextMonth)];
        },
        updated(){
            this.updateDate();
        },
        methods: {
            updateDate() {
                let month = getComputerMonthNumber(this.$route.params.month as string);
                this.year = (this.$route.params.year === '') ? this.calendar.current.getFullYear() : this.$route.params.year;
                this.month = this.calendar.months[(this.$route.params.month === '') ? this.calendar.current.getMonth() : month].name;
                this.monthNumber = month;
            },
            changeMonthByNameMonth(name: string) {
                let month = getNormalMonthNumber(this.calendar.months.findIndex((e: Month) => e.name === name));
                return getNormalFormatMonthOrDay(month);
            },
            changeMonthByDirection(direction: boolean) {
                let month = this.calendar.months.findIndex((e: Month) => e.name === this.month) + ((direction) ? 2 : 0);
                return (month === 0) ? `../${Number(this.year) - 1}/12` : (month > 12) ? `../${Number(this.year) + 1}/01` : getNormalFormatMonthOrDay(month);
            },
        },
        computed: {
            ...mapState(['calendar']),
            getEvents() {
                return [...this.calendar.defaultEvents, ...this.calendar.customEvents]
                    .map(e => ({ ...e, dates: convertDatesBySchemes(e.schemes, Number(this.$route.params.year)) }))
                    .map(e => ({ name: e.name, time: e.time, days: e.dates.filter((i: string) => i
                        .startsWith(`${this.$route.params.year}-${this.$route.params.month}`))
                        .map((x: string) => `${Number(x.slice(-2))}`) })) as Array<MonthEventDay>;
            },
        },
        components: {
            CalendarHeader: defineAsyncComponent(() => import('@/components/common/CalendarHeader.vue')),
            CalendarMonth: defineAsyncComponent(() => import('@/components/month/CalendarMonth.vue')),
            CalendarMonthYear: defineAsyncComponent(() => import('@/components/year/CalendarMonth.vue')),
        }
    })
</script>

<style scoped>
    .month-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .month-content {
        width: fit-content;
        display: grid;
        gap: 10px;
    }

    .month-header {
        display: flex;
        justify-content: space-between;
        align-items: end;
    }

    .input-month {
        width: var(--input-month-width);
        background-color: transparent;
        color: var(--page-color);
        font-family: 'Times New Roman';
        font-size: var(--input-month-font-size);
        font-weight: bold;
        text-align: center;
        padding: 0px 5px;
        border: none;
    }

    @media (max-width: 768px) {
        .month-header {
            justify-content: center;
        }

        .month.large {
            display: none;
        }
    }
</style>
