import type { Module } from "vuex";
import type { CalendarEventsState, RootState } from '@/vuex/types';
import { CalendarEvent } from '@/data/enums';


export const calendarEventsModule: Module<CalendarEventsState, RootState> = {
    state: () => ({
        isActive: CalendarEvent.None,
        limitDates: 0,
    }),
    mutations: {
        setIsActive(state: CalendarEventsState, isActive: CalendarEvent) {
            state.isActive = isActive;
        },
        setLimitDates(state: CalendarEventsState, limitDates: number) {
            state.limitDates = limitDates;
        },
    },
    actions: {
        changeActiveEvent({ state, commit, dispatch }, event: CalendarEvent) {
            let nextEvent = (state.isActive === event) ? CalendarEvent.None : event;
            commit('setIsActive', nextEvent);
            commit('setLimitDates', nextEvent === CalendarEvent.Difference ? 2 : 1);
            dispatch('calendar/resetSelectDates', null, { root: true });
        },
    },
    namespaced: true,
}
