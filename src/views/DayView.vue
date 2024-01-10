<template>
    <main class="day">
        <h1 class="header">{{ date }}</h1>
        <div class="full-day-event-list">
            <EventDay v-for="event in fullDayEvents" :key="event.id" :event="event" @remove="removeCustomEvent($event)"/>
        </div>
        <section class="calendar-day">
            <h2>Расписание:</h2>
            <div v-for="hour in hours" :key="hour" class="day-hour">
                <div class="hour">{{ hour }}:00 ч.</div>
                <div class="hour-events" v-parallel-scroll>
                    <EventDay
                        v-for="event in eventsFilter(hour)"
                        :key="event.name"
                        :event="event"
                        @remove="removeCustomEvent($event)"/>
                    <div class="horizontal-line"><hr></div>
                </div>
            </div>
        </section>
    </main>
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';
    import { mapState, mapActions } from 'vuex';
    import { CalendarEvent, DayEventPosition } from "@/data/enums";
    import { convertDatesBySchemes, getComputerDateFormat, getRandomId } from '@/data/actions';
    import { hours } from '@/data';
    import type { DayEvent } from "@/vuex/types";
    import '@/assets/dayView.css';


    export default defineComponent({
        data() {
            return {
                date: new Date(this.$route.fullPath).toLocaleDateString(),
                hours: hours,
                events: [] as Array<DayEvent>,
                fullDayEvents: [] as Array<DayEvent>,
                notFullDayEvents: [] as Array<DayEvent>,
                maxRow: 0,
            };
        },
        mounted() {
            this.updateEvents();
        },
        methods: {
            ...mapActions({
                changeSelectDates: 'calendar/changeSelectDates',
                removeCustomEvent: 'calendar/removeCustomEvent',
            }),
            updateEvents() {
                let full = [] as Array<DayEvent>, notFull = [] as Array<DayEvent>;
                [...this.calendar.defaultEvents, ...this.calendar.customEvents]
                    .map(e => ({
                        ...e,
                        isDefault: this.calendar.defaultEvents.indexOf(e) === -1,
                        dates: convertDatesBySchemes(e.schemes, Number(this.$route.params.year)).filter(i => i === this.$route.fullPath.slice(1).replace(/\//g, '-')) }))
                    .filter(e => e.dates.length)
                    .forEach(event => (!event.time || event.time.start === 0 && event.time.end === 23) ? full.push(event) : notFull.push(event));
                this.fullDayEvents = full;
                this.notFullDayEvents = notFull;
            },
            eventsFilter(hour: number) {
                const getPosition = (time: { start: number, end: number }, hour: number) => {
                    if (time.start == time.end) return DayEventPosition.One;
                    else if (time.end == hour) return DayEventPosition.End;
                    else if (time.start == hour) return DayEventPosition.Start;
                    return DayEventPosition.Center;
                }

                let result = this.getNotFullDayEvets
                    .filter(event => event.time!.start <= hour && event.time!.end >= hour)
                    .map(e => ({...e, class: getPosition(e.time!, hour)}));
                
                for (let i = 0; i < result.length; i++) {
                    if (result[i].row - 1 !== i) {   
                        result.splice(i, 0, { id: getRandomId(), name: '', hours: [] as Array<number>, row: i, class: DayEventPosition.Empty });
                    }
                }
                result.push(...Array(this.maxRow - [...result, { row: 0 }]
                    .reduce((acc, curr) => acc.row > curr.row ? acc : curr).row)
                    .fill({ hours: [] as Array<number>, row: 0, class: DayEventPosition.Empty })
                    .map(e => ({ ...e, id: getRandomId() })));
        
                return result;
            },
        },
        watch: {
            'calendar.customEvents': function () {
                this.updateEvents();
            },
            'calendarEvents.isActive': function (nextValue) {
                if (nextValue === CalendarEvent.Event) {
                    this.changeSelectDates(getComputerDateFormat(this.date.replace(/\./g, '-').split('-').reverse().join('-')));
                }
            },
        },
        computed: {
            ...mapState(['calendar', 'calendarEvents']),
            getNotFullDayEvets() {
                let result = this.notFullDayEvents.map(e => ({
                    ...e,
                    hours: Array.from({length: e.time!.end - e.time!.start + 1}, (_, i) => Number(e.time!.start) + i),
                    row: 1,
                }));

                for (let i = 0; i < result.length; i++) {
                    let element = result[i];
                    if (result.slice(0, i).flatMap(e => e.hours).some(r=> element.hours.includes(r))) {
                        element.row += [...result.slice(0, i), { row: 0 }].reduce((max, obj) => obj.row > max.row ? obj : max).row;         
                    }
                }

                if (result.length) this.maxRow = result.reduce((acc, curr) => acc.row > curr.row ? acc : curr).row;
                return result;
            },
        },
        components: {
            EventDay: defineAsyncComponent(() => import('@/components/day/EventDay.vue')),
        }
    })
</script>

<style scoped>
    .day {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .header {
        text-align: center;
    }
    
    .calendar-day {
        width: fit-content;
        min-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .day-hour {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .day-hour:not(:first-child) {
        border-top: 1px solid var(--page-color);
    }

    .hour-events {
        width: 100%;
        min-height: 45px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .hour {
        width: 55px;
        flex-shrink: 0;
        text-align: center;
    }

    .full-day-event-list {
        width: fit-content;
        display: flex;
        gap: 10px;
        padding: 10px;
    }

    .horizontal-line {
        width: 100%;
        height: 100%;
    }

    @media (max-width: 992px) {
        .calendar-day {
            max-width: 100%;
        }

        .hour-events {
            overflow: auto;
        }
    }
</style>