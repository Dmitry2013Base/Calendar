<template>
    <ModalForm
        ref="eventForm"
        :submit="submit"
        @close="$emit('closeForm')">

        <p class="form-name">Рабочие дни</p>
        <CustomInput
            ref="date"
            type="date"
            placeholder="Дата"
            :error="error"
            :value="changeDateFormat(0)"
            @input="changeSelectDatesByIndex({ index: 0, date: ($event.target as HTMLInputElement).value })"/>
        
        <CustomSelect ref="work" v-if="calendar.selectDates.length" placeholder="График работы" :data="getWorkChartArray"/>
        <BaseButton>Показать</BaseButton>
    </ModalForm>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapState, mapActions } from "vuex";
    import { WorkChart } from '@/data/enums';
    import { getNormalDateFormat } from '@/data/actions';
    import type { WorkDay } from '@/vuex/types';


    export default defineComponent({
        data() {
            return {
                error: '',    
            }
        },
        methods: {
            ...mapActions({
                changeSelectDatesByIndex: 'calendar/changeSelectDatesByIndex',
                changeWorkDate: 'calendar/changeWorkDate',
            }),
            changeDateFormat(index: number) {
                return (this.calendar.selectDates.length) ? getNormalDateFormat(this.calendar.selectDates[index], false) : '';
            },
            submit() {
                this.error = ((this.$refs.date as any).currentValue?.trim() === '') ? 'Пустое поле' : '';
                if (this.error === '') {
                    this.changeWorkDate({
                        start: (this.$refs.date as any).currentValue,
                        schedule: (this.$refs.work as any).selected,
                    } as WorkDay);
                    (this.$refs.eventForm as any).close();
                }
            },
        },
        computed: {
            ...mapState(['calendar']),
            getWorkChartArray() {
                return Object.values(WorkChart).map(e => ({ value: e, text: e }));
            },
        },
    })
</script>

<style scoped>
    .form-name {
        font-size: 22px;
        font-weight: bold;
    }
</style>
