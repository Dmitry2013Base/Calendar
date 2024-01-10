<template>
    <div class="textarea-container">
        <textarea class="textarea" v-model="currentValue" required></textarea>
        <label v-if="placeholder" class="placeholder">{{ placeholder }}</label>
        <span class="focus-border"></span>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'CustomTextarea',
        data() {
            return {
                currentValue: '',
            };
        },
        props: {
            placeholder: {
                type: String,
                default: '',
            },
            value: {
                type: String,
                default: '',
            },
        },
        mounted() {
            this.changeValue(this.value);
        },
        methods: {
            changeValue(nextValue: string) {
                this.currentValue = nextValue;
            },
        },
        watch: {
            value(nextValue) {
                this.changeValue(nextValue);
            },
        },
    })
</script>

<style scoped>

    :focus {
        outline: none;
    }

    .textarea-container {
        position: relative;
    }

    .textarea {
        width: 100%;
        min-height: 100px;
        background-color: transparent;
        color: var(--input-color);
        font-size: 18px;
        letter-spacing: 1px;
        padding: 15px 5px 5px 0px;
        border: 0;
        border-bottom: 1px solid var(--input-default-color-border);
        resize: none;
    }

    .textarea ~ .focus-border{
        position: absolute;
        bottom: 3px;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: var(--season-text-color);
        transition: .4s;
    }

    .textarea:focus ~ .focus-border,
    .textarea:not(:focus):valid ~ .focus-border {
        width: 100%;
        left: 0;
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

    
    .textarea:focus ~ .placeholder,
    .textarea:not(:focus):valid ~ .placeholder {
        font-size: 12px;
        color: var(--season-text-color);
        top: 0;
    }
</style>
