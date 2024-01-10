<template>
    <div
        :class="[ 'day', ...classes, (isSelect) && 'select-day' ]"
        :title="title">
        {{ dayName }}
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        props: {
            dayName: {
                type: String,
                required: true
            },
            isVisible: {
                type: Number,
                default: 1
            },
            isSelect: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            classes: {
                type: Array,
                default: [] as Array<string>
            }
        },
    })
</script>

<style scoped>
    .day {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid transparent;
        border-radius: 50%;
        font-size: var(--font-size-day-number);
        transition: all .1s linear;
        aspect-ratio: 1 / 1;
        opacity: v-bind(isVisible);
    }

    .day:not(.weekday):hover {
        border: 1px solid;
        cursor: pointer;
    }
    
    .weekday {
        font-weight: 900;
    }
    
    .empty {
        pointer-events: none;
    }

    .weekend {
        color: var(--weekend-color);
    }

    .summer {
        color: var(--summer-color);
    }

    .winter {
        color: var(--winter-color);
    }
    
    .autumn {
        color: var(--autumn-color);
    }

    .spring {
        color: var(--spring-color);
    }

    .holiday {
        color: var(--holiday-color) !important;
        font-weight: 900;
    }

    .current-day {
        background-color: var(--current-day-background-color);
    }

    .work-day {
        font-weight: 900;
    }

    .custom::after {
        content: '';
        position: absolute;
        width: 7px;
        height: 7px;
        background-color: var(--season-text-color);
        border-radius: 50%;
        top: -3px;
        right: -3px;
    }

    .select-day {
        text-decoration: underline;
        color: var(--select-day-color)
    }
    
    @media (max-width: 576px) {
        .custom::after {
            width: 4px;
            height: 4px;
        }
    }
</style>
