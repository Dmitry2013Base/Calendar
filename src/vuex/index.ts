import { createStore } from 'vuex';
import { calendarModule } from "@/vuex/calendarModule";
import { calendarEventsModule } from "@/vuex/calendarEventsModule";


export default createStore({
    state() {
        return {
            version: '1.0.0',
        }
    },
    modules: {
        calendar: calendarModule,
        calendarEvents: calendarEventsModule,
    }
})
