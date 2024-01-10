<template>
    <div class="checkbox-container" @click="changeValue">
        <input type="checkbox" v-model="currentValue" hidden>
        <label class="header">{{ header }}</label>
        <div class="checkbox"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'CustomCheckbox',
        data() {
            return {
                currentValue: false,
            };
        },
        props: {
            header: {
                type: String,
                default: ''
            },
            value: {
                type: Boolean,
                default: false,
            },
        },
        mounted() {
            this.currentValue = this.value;
        },
        methods: {
            changeValue() {
                this.currentValue = !this.currentValue;
                this.$emit('changeValue', this.currentValue);
            }
        },
    })
</script>

<style scoped>
    .checkbox-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        padding: 5px;
    }

    .checkbox {
        width: 15px;
        height: 15px;
        border: 1px solid var(--page-color);
        border: 1px solid var(--season-text-color);
        border-radius: 2px;
        position: relative;
        cursor: pointer;
        transition: all .4s;
    }

    input[type='checkbox']:checked ~ .checkbox {
        background-color: var(--season-text-color);
    }

    input[type='checkbox']:checked ~ .checkbox::after {
        content: '';
        width: 7px;
        height: 3px;
        position: absolute;
        top: 3px;
        left: 2px;
        border: 2px solid var(--page-background-color);
        border-top: none;
        border-right: none;
        background: transparent;
        transform: rotate(-45deg);
    }

    .header {
        font-size: 18px;
        cursor: pointer;
    }

    .checkbox:hover,
    .header:hover ~ .checkbox {
        background-color: var(--season-backgroung-color);
    }
</style>

