<template>
    <button class="button">
        <slot></slot>
    </button>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'BaseButton',
    })
</script>

<style scoped>
    .button {
        font-size: 18px;
        padding: 5px 10px;
        border-radius: 0;
        color: var(--season-text-color);
        border: 2px solid var(--season-text-color);
        background-color: transparent;
        cursor: pointer;
        transition: all .4s;
    }

    .button:hover {
        color: #000;
        border-color: var(--season-backgroung-color);
        box-shadow: inset 0 0 0 2em var(--season-backgroung-color);
    }
</style>
