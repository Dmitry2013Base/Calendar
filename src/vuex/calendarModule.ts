import type { Module } from "vuex";
import type { CalendarEvent, CalendarState, RootState, WorkDay } from '@/vuex/types';
import { months, weekdays, defaultEvents, customEvents, current } from "@/data";


export const calendarModule: Module<CalendarState, RootState> = {
    state: () => ({
        months: months,
        weekdays: weekdays,
        defaultEvents: defaultEvents,
        customEvents: customEvents,
        selectDates: [],
        workDates: null,
        current: current,
    }),
    mutations: {
        setSelectDates(state: CalendarState, selectDates: Array<string>) {
            state.selectDates = selectDates;     
        },
        setWorkDates(state: CalendarState, workDates: WorkDay | null) {
            state.workDates = workDates;
        },
        setCustomEvents(state: CalendarState, customEvents: Array<CalendarEvent>) {
            state.customEvents = customEvents;
        },
    },
    actions: {
        changeSelectDatesByIndex({ state, commit, dispatch }, item: { index: number, date: string }) {
            const changeDateFormat = (str: string) => str.split('-').map(x => (x.startsWith('0')) ? x.slice(1) : x).join('-');

            if (state.selectDates.length > item.index) {         
                if (item.date !== '') {
                    commit('setSelectDates', state.selectDates.map((e, i) => (i === item.index) ? changeDateFormat(item.date) : e));
                } else {
                    commit('setSelectDates', state.selectDates.filter((e, i) => i !== item.index));
                }
            } else {
                dispatch('changeSelectDates', changeDateFormat(item.date));
            }
        },
        changeSelectDates({ state, commit, rootState }, date: string) {
            let nextSelectDates = [];
            if (state.selectDates.includes(date)) {
                nextSelectDates = state.selectDates.filter(e => e !== date);
            } else {
                if (state.selectDates.length < (rootState as any).calendarEvents.limitDates) {
                    nextSelectDates = [...state.selectDates, date];
                } else {
                    nextSelectDates = state.selectDates.map((e, i) => (i === state.selectDates.length - 1) ? date : e);
                }
            }
            commit('setSelectDates', nextSelectDates);
        },
        changeWorkDate({ commit }, workDate: WorkDay | null) {
            commit('setWorkDates', workDate);
        },
        resetSelectDates({ commit }) {
            commit('setSelectDates', []);
            commit('setWorkDates', null);
        },
        createCustomEvent({ state, commit, dispatch }, event: CalendarEvent) {
            commit('setCustomEvents', [...state.customEvents, event]);
            dispatch('resetSelectDates');
        },
        removeCustomEvent({ state, commit }, event: CalendarEvent) {
            commit('setCustomEvents', [...state.customEvents.filter(e => e.id !== event.id)]);
        },
    },
    namespaced: true,
}
