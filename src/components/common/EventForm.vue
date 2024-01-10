<template>
    <ModalForm
        ref="eventForm"
        :submit="submit"
        @close="() => { date = ''; $emit('closeForm') }">

        <p class="form-name">Добавить событие</p>
        <CustomInput
            ref="date"
            type="date"
            placeholder="Дата"
            :error="errors[0]"
            :value="changeDateFormat(0)"
            @input="changeSelectDatesByIndex({ index: 0, date: ($event.target as HTMLInputElement).value })"/>
        
        <CustomSelect v-if="calendar.selectDates.length" placeholder="Повторение" :data="getRepeatArray" @setSelect="selectedMode = $event"/>
        <div>
            <CustomCheckbox header="Весь день" :value="isAllDay" @changeValue="isAllDay = $event"/>
            <div v-show="!isAllDay">
                <div class="time-list">
                    <p class="time-name">Начало:</p>
                    <CustomSelect ref="start" :data="hourNames" defaultValue="8"/>
                    <p class="time-name">Конец:</p>
                    <CustomSelect ref="end" :data="hourNames" defaultValue="9"/>
                </div>
                <p class="error">{{ errors[1] }}</p>
            </div>
        </div>

        <div class="type-events">
            <CustomSelect v-if="calendar.selectDates.length" ref="style" placeholder="Стиль" :data="getDateTypeArray"/>
            <CustomCheckbox v-if="selectedMode === repeatOnce" header="Несколько дат" @changeValue="isMoreDates = $event"/>
        </div>
   
        <div v-if="isMoreDates && selectedMode === repeatOnce" class="more-dates">
            <CustomInput
                v-for="(_, index) in moreDates.length + 1"
                type="date"
                placeholder="Дата"
                :value="moreDates[index]"
                @input="moreDates[index] = ($event.target as HTMLInputElement).value"/>
        </div>

        <CustomInput v-if="selectedMode === repeatOnce && !isMoreDates" type="number" value="1" placeholder="Кол-во дней" ref="count" :error="errors[2]"/>
        <CustomInput placeholder="Название" ref="name" :error="errors[3]"/>
        <CustomTextarea placeholder="Описание" ref="description"/>
        <BaseButton>Добавить</BaseButton>
    </ModalForm>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapState, mapActions } from "vuex";
    import { hours, weekdays } from '@/data';
    import { DayType, RepeatMode, TypeCalendarEvent, CalendarEvent as CalendarEventEnum } from '@/data/enums';
    import { capitalizeFirstLetter, getPhraseGender } from "@/data/dictionary";
    import { getNumberDayWeekInMonth, getNormalWeekDay, getNormalDateFormat, addDays, convertDatesByRepeatMode, getRandomId } from '@/data/actions';
    import type { CalendarEvent } from '@/vuex/types';


    export default defineComponent({
        data() {
            return {
                hours: hours,
                hourNames: hours.map(e => ({ text: `${e}:00`, value: e})),
                repeatOnce: RepeatMode.Once,
                selectedMode: RepeatMode.None,
                date: '',
                isMoreDates: false,
                isAllDay: true,
                moreDates: [] as Array<string>,
                errors: Array(4).fill(''),
            }
        },
        methods: {
            ...mapActions({
                changeSelectDatesByIndex: 'calendar/changeSelectDatesByIndex',
                createCustomEvent: 'calendar/createCustomEvent',
                changeActiveEvent: 'calendarEvents/changeActiveEvent',
            }),
            changeDateFormat(index: number) {
                return (this.calendar.selectDates.length) ? getNormalDateFormat(this.calendar.selectDates[index], false) : '';
            },
            submit() {
                const emptyError = (str?: string) => (str?.trim() === '') ? 'Пустое поле' : '';

                let name = (this.$refs.name as any).currentValue.trim();
                let date = (this.$refs.date as any).currentValue;
                let count = (this.$refs.count as any)?.currentValue;
                let timeStart = (this.$refs.start as any)?.selected;
                let timeEnd = (this.$refs.end as any)?.selected;
                this.errors[0] = emptyError(date);
                this.errors[1] = (!this.isAllDay && Number(timeStart) >= Number(timeEnd)) ? 'Не правильно указано время' : '';
                this.errors[3] = emptyError(name);

                if (this.selectedMode === RepeatMode.Once) {
                    this.errors[2] = (count < 0 || count >= 21) ? 'Кол-во дней должно быть 1-20 дней' : emptyError(`${count}`);
                    
                    if (this.errors[2] === '') {
                        let nextDate = new Date(date);
                        for (let i = 0; i < count - 1; i++) {
                            nextDate = addDays(new Date(nextDate), 1);
                            this.moreDates.push(getNormalDateFormat(`${nextDate.getFullYear()}-${nextDate.getMonth()}-${nextDate.getDate()}`));
                        }
                    }
                }
                
                if (this.errors.every(e => e === '')) {
                    const getDayType = (event: TypeCalendarEvent) => {
                        switch (event) {
                            case TypeCalendarEvent.Custom:
                                return DayType.Custom;
                            case TypeCalendarEvent.Holiday:
                                return DayType.Holiday;
                            case TypeCalendarEvent.Weekend:
                                return DayType.Weekend;
                            case TypeCalendarEvent.WorkDay:
                                return DayType.WorkDay;
                        }
                    }
                
                    this.createCustomEvent({
                        id: getRandomId(),
                        name,
                        description: (this.$refs.description as any).currentValue.trim(),
                        schemes: convertDatesByRepeatMode([...new Set([date, ...this.moreDates])], this.selectedMode as RepeatMode),
                        types: [{ name: (this.$refs.style as any)?.selected, class: getDayType((this.$refs.style as any)?.selected) }],
                        time: (!this.isAllDay) ? { start: timeStart, end: timeEnd } : undefined,
                    } as CalendarEvent);

                    this.isMoreDates = false;
                    this.moreDates = [];
                    (this.$refs.eventForm as any).close();
                    this.changeActiveEvent(CalendarEventEnum.None);
                }
            },
        },
        computed: {
            ...mapState(['calendar', 'calendarEvents']),
            getDateTypeArray() {
                return Object.values(TypeCalendarEvent).map(e => ({ text: e, value: e }));
            },
            getRepeatArray() {
                let date = this.calendar.selectDates[0];
                this.date = date;
                let weeks = ['первый', 'второй', 'третий', 'четвертый', 'последний'];
                let month = this.calendar.months[(new Date(date).getMonth())].name;
                let week = getNumberDayWeekInMonth(date);
                let day = weekdays.find(e => e.value === getNormalWeekDay(new Date(date).getDay()))?.fullName;

                return Object.values(RepeatMode)
                    .filter(e => e !== RepeatMode.None)
                    .flatMap(e => {
                    if (e === RepeatMode.Relative) {
                        return {
                            value: `${e}`,
                            text: capitalizeFirstLetter(getPhraseGender(`каждый ${weeks[week - 1]} ${day} ${month.replace(/(ь|й)$/g, 'я').replace(/(т)$/g, 'та')}`))
                        };
                    }
                    if (e === RepeatMode.EachWeekNumber) {
                        return [
                            { value: `${e}-1`, text: 'Каждую неделю' },
                            { value: `${e}-2`, text: 'Каждые 2 недели' },
                            { value: `${e}-3`, text: 'Каждые 3 недели' },
                        ];
                    }
                    return { value: `${e}`, text: e };
                });
            }
        },
    })

</script>

<style scoped>
    .form-name {
        font-size: 22px;
        font-weight: bold;
    }

    .type-events {
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 10px;
    }

    .time-list {
        display: flex;
        justify-content: center;
        align-items: baseline;
        gap: 10px;
    }

    .time-name {
        font-size: 20px;
    }

    .more-dates {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .error {
        font-size: 13px;
        color: var(--error-color);
    }
</style>
