<template>
    <h1 class="header-container">
        <span class="arrow left" @click="leftArrowClick()">&#10148;</span>
        <form @submit.prevent="submit()">
            <slot></slot>
            <input type="submit" hidden>
        </form>
        <span class="arrow" @click="rightArrowClick()">&#10148;</span>
    </h1>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: {
            leftArrowClick: {
                type: Function,
                required: true,
            },
            rightArrowClick: {
                type: Function,
                required: true,
            },
            submit: {
                type: Function,
                required: true,
            },
        },
    })
</script>

<style scoped>
    .header-container {
        font-size: var(--calendar-header-font-size);
        padding: 5px;
        display: flex;
        align-items: center;
        gap: var(--calendar-header-gap);
    }
    
    .left {
        -moz-transform: scale(-1, 1);
        -webkit-transform: scale(-1, 1);
        -o-transform: scale(-1, 1);
        -ms-transform: scale(-1, 1);
        transform: scale(-1, 1);
    }

    .arrow:hover {
        color: var(--season-text-color);
        cursor: pointer;
    }
</style>
