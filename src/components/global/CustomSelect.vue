<template>
    <div class="select-container">
        <select class="select" v-model="selected">
            <option v-for="item in data" :key="item.value" :value="item.value">{{ item.text }}</option>
        </select>
        <label v-if="placeholder" class="placeholder">{{ placeholder }}</label>
        <span class="focus-border"></span>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'CustomSelect',
        data() {
            return {
                selected: '',
            };
        },
        props: {
            data: {
                type: Array<{ text: string, value: string }>,
                required: true
            },
            placeholder: {
                type: String,
                default: ''
            },
            defaultValue: {
                type: String,
                default: ''
            },
        },
        mounted() {
            this.selected = (this.defaultValue) ? this.defaultValue : this.data[0]?.value;
        },
        watch: {
            selected(nextValue) {
                this.$emit('setSelect', nextValue);
            }
        }
    })
</script>

<style scoped>
    :focus {
        outline: none;
    }

    .select-container {
        width: 100%;
        position: relative;
    }

    .select {
        font-size: 18px;
        width: 100%;
        background-color: transparent;
        color: var(--input-color);
        letter-spacing: 1px;
        padding: 15px 5px 5px 0px;
        border: 0;
        border-bottom: 1px solid var(--input-default-color-border);
    }
    option {
        color: #000;
    }

    .select option:checked {
        background-color: var(--season-backgroung-color);
    }

    .placeholder {
        font-size: 20px;
        letter-spacing: 1px;
        color: var(--input-default-color-border);
        position: absolute;
        top: 13px;
        left: 0;
        pointer-events: none;
        transition: .4s;
    }

    .select:focus ~ .placeholder,
    .select:not(:focus):valid ~ .placeholder {
        font-size: 12px;
        color: var(--season-text-color);
        top: 0;
    }

    .select ~ .focus-border{
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: var(--season-text-color);
        transition: .4s;
    }

    .select:focus ~ .focus-border,
    .select:not(:focus):valid ~ .focus-border {
        width: 100%;
        left: 0;
    }
</style>
