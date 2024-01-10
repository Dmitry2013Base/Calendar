<template>
    <header>
        <nav class="navbar-container">
            <div class="nav-buttons">
                <router-link class="link main-link" to="/" exact>Календарь</router-link>
                <BaseButton class="burger-button" @click.stop="isActiveBurger = !isActiveBurger">
                    <span :class="['line', (isActiveBurger) && 'active']"></span>
                </BaseButton>
            </div>
            <div :class="['nav-content', (isActiveBurger) && 'active']">
                <ul class="list-link">
                    <li v-for="item in getCalendarEventList">
                        <HeaderCheckbox
                            :key="item.header"
                            :header="item.header"
                            :value="calendarEvents.isActive === item.value"
                            @changeValue="changeValue(item.value)"
                            class="button-link"/>
                    </li>
                    <li v-for="item in getCalendarLinks" :key="item.name">
                        <router-link class="link" :to="item.link" exact>{{ item.name }}</router-link>
                    </li>
                </ul>
            </div>
        </nav>
        <Notification :selector="selector" :text="notification"/>
        <EventForm ref="event"/>
        <WorkForm ref="work"/>
    </header> 
</template>
    
<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';
    import { mapState, mapActions } from 'vuex';
    import { CalendarEvent, CalendarEvent as CalendarEventEnum } from "@/data/enums";
    import { getDifferenceBetweenDates, getLocaleDateString, getNormalFormatMonthOrDay, getNormalMonthNumber } from '@/data/actions';


    export default defineComponent ({
        name: 'CustomHeader',
        data() {
            return {
                isActiveBurger: false,
                calendarEventList: [
                    { header: 'Добавить событие', value: CalendarEvent.Event, routes: ['year', 'month', 'day'] },
                    { header: 'Разница между датами', value: CalendarEvent.Difference, routes: ['year', 'month'] },
                    { header: 'Рабочие дни', value: CalendarEvent.Work, routes: ['year'] }
                ],
                lastEventList: [] as Array<{header: string, value: CalendarEvent, routes: Array<string>}>,
                notification: '',
                selector: false,
            };
        },
        props: {
            routeName: {
                type: String,
                required: true
            },
            burgerSelector: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            ...mapActions({
                changeActiveEvent: 'calendarEvents/changeActiveEvent',
            }),
            changeValue(value: CalendarEvent) {
                this.changeActiveEvent(value);
                if (this.calendarEvents.isActive !== CalendarEvent.None) {
                    this.getNotification(`Выберите дат${this.calendarEvents.limitDates > 1 ? 'ы' : 'у'}`);
                }
            },
            getNotification(notification: string) {
                this.notification = notification;
                this.selector = !this.selector;
            },
        },
        computed: {
            ...mapState(['calendar', 'calendarEvents']),
            getCalendarLinks() {
                let year = this.calendar.current.getFullYear();
                let month = getNormalFormatMonthOrDay(getNormalMonthNumber(this.calendar.current.getMonth()));
                let day = getNormalFormatMonthOrDay(this.calendar.current.getDate());
                return [
                    { name: 'Год', link: `/${year}` },
                    { name: 'Месяц', link: `/${year}/${month}` },
                    { name: 'День', link: `/${year}/${month}/${day}` },
                ];
            },
            getCalendarEventList() {
                let nextEventList = this.calendarEventList.filter(e => e.routes.includes(this.routeName));
                if (this.lastEventList.length !== nextEventList.length) {
                    this.changeActiveEvent(CalendarEvent.None);
                }
                this.lastEventList = nextEventList;
                return nextEventList;
            }
        },
        watch: {
            'calendar.selectDates': function () {
                if (this.calendar.selectDates.length === this.calendarEvents.limitDates) {
                    switch (this.calendarEvents.isActive) {
                        case CalendarEventEnum.Event:
                            (this.$refs.event as any).$refs.eventForm.open();
                            break;
                        case CalendarEventEnum.Difference:
                            let first = this.calendar.selectDates[0], second = this.calendar.selectDates[1];
                            let count = Math.abs(getDifferenceBetweenDates(first, second));
                            let result = (count >= 5 && count <= 20) ? "дней" : (count % 10 === 1) ? 'день' : (count % 10 >= 2 && count % 10 <= 4) ? 'дня' : "дней";
                            this.getNotification(`Между ${getLocaleDateString(first)} и ${getLocaleDateString(second)} - ${count} ${result}!`);
                            break;
                        case CalendarEventEnum.Work:
                            (this.$refs.work as any).$refs.eventForm.open();
                            break;
                    }
                }
            },
            burgerSelector() {
                if (this.isActiveBurger) this.isActiveBurger = false;
            },
        },
        components: {
            EventForm: defineAsyncComponent(() => import('@/components/common/EventForm.vue')),
            WorkForm: defineAsyncComponent(() => import('@/components/common/WorkForm.vue')),
        }
    })
</script>
      
<style scoped>
    header {
        background-color: var(--header-background-color);
        color: var(--header-color);
        padding: 8px 0;
        font-size: 16px;
        position: relative;
    }

    .navbar-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
    }

    .nav-buttons {
        display: flex;
        justify-content: space-between;
    }

    .nav-content {
        display: flex;
        justify-content: end;
    }
    
    .list-link {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        gap: 7px;
    } 

    .link {
        padding: 8px;
        text-wrap: nowrap;
        text-decoration: none;
        color: var(--header-color);
        display: block;
    }

    .button-link:hover,
    .link:hover {
        color: var(--season-text-color);
        transition: all .4s;
    }

    .main-link {
        font-size: 22px;
        padding: 5px;
        padding-left: 0;
    }

    .burger-button {
        aspect-ratio: 1 / 1;
        padding: 5px !important;
        display: none;
    }

    .line {
        display: block;
        position: relative;
        width: 30px;
        height: 2px;
        background-color: var(--season-text-color);
        transition: all 0.1s linear;
    }

    .line::before,
    .line::after {
        content: '';
        display: block;
        position: absolute;
        width: 30px;
        height: 2px;
        top: -9px;
        background-color: var(--season-text-color);
        transition: all 0.1s linear;
    }

    .burger-button:hover .line:not(.active),
    .burger-button:hover .line::before,
    .burger-button:hover .line::after {
        background-color: var(--page-color);
    }

    .line::after {
        top: 9px;
    }

    .line.active {
        background-color: transparent;
    }

    .line.active::before {
        transform: rotate(-45deg);
        top: 0px;
    }

    .line.active::after {
        transform: rotate(45deg);
        top: 0px;
    }

    @media (max-width: 992px) {
        .list-link {
            max-width: 100%;
            height: max-content;
            flex-direction: column;
            justify-content: center;
            background-color: var(--season-backgroung-color);
            position: absolute;
            top: 100%;
            right: 0;
            transition: 0.3s linear;
            overflow: hidden;
            z-index: 1000000;
        }

        .list-link li * {
            padding: 5px 10px;
            color: #000;
        }

        .nav-content:not(.active) .list-link {
            max-width: 0;
            transform: translateX(100%);
        }

        .burger-button {
            display: block;
        }

        .nav-buttons {
            width: 100%;
        }
    }
</style>
      