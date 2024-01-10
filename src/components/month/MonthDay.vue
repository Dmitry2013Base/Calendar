<template>
    <div :class="['day', ...classes, (isSelectDay) && 'select-day']">
        <IconPlus v-if="!classes.includes('other') && !classes.includes('weekday')" class="create-event-button" @click="$emit('changeDay', dayName, true)"/>
        <div class="day-name" @click="$emit('changeDay', dayName, false)">{{ dayName }}</div>
        <div v-if="!classes.includes('other') && !classes.includes('weekday') && eventsCount > 0" class="event-count"><span>{{ eventsCount }}</span></div>
    </div>
</template>
    
<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';


    export default defineComponent ({
        props: {
            dayName: {
                type: String,
                required: true
            },
            classes: {
                type: Array,
                default: [] as Array<string>
            },
            eventsCount: {
                type: Number,
                default: 0,
            },
            isSelectDay: {
                type: Boolean,
                default: false,
            }
        },
        components: {
            IconPlus: defineAsyncComponent(() => import('@/components/icons/IconPlus.vue')),
        }
    })
</script>
      
<style scoped>
    .day {
        width: var(--month-day-width);
        height: var(--month-day-height);
        font-size: var(--month-day-font-size);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: end;
        outline: 1px solid var(--page-color);
        overflow: hidden;
    }

    .day-name {
        font-weight: bold;
        padding: 5px;
    }

    .day:not(.weekday) .day-name {
        font-size: var(--day-name-font-size);
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translateX(50%) translateY(-50%);
        transition: all .5s;
    }

    .current-day {
        background-color: var(--current-day-background-color);
    }

    .select-day {
        color: var(--select-day-color) !important;
    }

    .create-event-button {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 5px;
        left: 5px;
        fill: var(--page-color);
        cursor: pointer;
        transition: all .5s;
    }

    .event-count {
        width: 18%;
        font-size: var(--event-count-font-size);
        aspect-ratio: 1 / 1;
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 3px;
        background-color: var(--season-backgroung-color);
        border-radius: 50%;
        text-align: center;
        color: #000;
        transition: all .5s;
    }

    .weekday.large {
        display: var(--visible-large-weekday);
    }
    
    .weekday.small {
        display: var(--visible-small-weekday);
    }

    .weekday {
        align-items: center;
        height: fit-content;
        color: #000;
        background-color: var(--season-backgroung-color);
        letter-spacing: 1px;
        font-size: 20px;
    }

    .weekend {
        color: var(--weekend-color);
    }

    .other {
        color: var(--other-day-color);
        background-color: var(--other-day-background-color);
    }

    @media (max-width: 768px) {
        .event-count {
            top: 3px;
            right: 3px;
        }

        .create-event-button {
            display: none;
        }
    }

    @media (max-width: 576px) {
        .event-count {
            width: 12%;
        }

        .event-count span {
            display: none;
        }
    }

    @media (min-width: 992px) {
        .day:not(.weekday):not(.other):hover .day-name:hover {
            color: var(--season-text-color);
            cursor: pointer;
        }

        .create-event-button:hover {
            fill: var(--season-text-color);
        }

        .event-count {
            top: 3px;
            right: 3px;
        }
    }
</style>
