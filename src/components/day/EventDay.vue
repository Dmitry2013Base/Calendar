<template>
    <div class="hour-event" :title="(!event.time || (event.time.start === 0 && event.time.end === 23)) ? `Весь день` : `С ${event.time.start}:00 по ${event.time.end}:00`">
        <div :class="['event', event.class]">
            <div v-if="typeof(event.class) === 'undefined' || event.class === 'start' || event.class === 'one'">
                <IconPlus v-if="event.isDefault" class="remove-button" @click="$emit('remove', event)"/>
                <div class="event-name">{{ event.name }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue';


    export default defineComponent({
        props: {
            event: {
                type: Object,
                required: true
            }
        },
        components: {
            IconPlus: defineAsyncComponent(() => import('@/components/icons/IconPlus.vue')),
        }
    })
</script>

<style scoped>
    .hour-event {
        width: var(--hour-event-width);
        height: var(--hour-event-height);
        position: relative;
        flex-shrink: 0;
    }

    .hour-event:has(.empty) {
        pointer-events: none;
    }

    .event {
        width: 100%;
        height: 100%;
        background-color: var(--season-backgroung-color);
        color: #000;
        border-radius: 10px;
        padding: 5px 10px;
        position: absolute;

    }

    .start {
        top: 10%;
        height: 90%;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .center {  
        border-radius: 0;
    }

    .end {
        height: 90%;
        top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .one {
        top: 10%;
        height: 80%;
    }

    .empty {
        background-color: transparent;
        color: transparent;
    }

    .event-name {
        width: 90%;
        font-size: var(--event-name-font-size);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .remove-button {
        width: var(--remove-button-size);
        height: var(--remove-button-size);
        position: absolute;
        top: 5px;
        right: 5px;
        transform: rotate(45deg);
        cursor: pointer;
    }

    .remove-button:hover {
        fill: var(--error-color);
    }
</style>
