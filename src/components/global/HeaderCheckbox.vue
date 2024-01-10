<template>
    <div class="checkbox-container" @click="$emit('changeValue')">
        <input type="checkbox" v-model="currentValue" hidden>
        <label class="header">{{ header }}</label>
        <span class="checked-border"></span>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'HeaderCheckbox',
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
        watch: {
            value(nextValue) {
                this.currentValue = nextValue;   
            }
        }
    })
</script>

<style scoped>
    .checkbox-container {
        display: flex;
        padding: 8px;
        cursor: pointer;
        position: relative;
    }

    .header {
        cursor: pointer;
    }

    input[type='checkbox'] ~ .checked-border {
        position: absolute;
        bottom: 4px;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: var(--season-text-color);
        transition: .4s;
    }

    input[type='checkbox']:checked ~ .checked-border {
        width: calc(100% - 10px);
        left: 6px;
    }
</style>

