<template>
    <div class="input-container">
        <div class="custom-input">
            <input class="input" :type="type" v-model="currentValue" required>
            <label v-if="placeholder" class="placeholder">{{ placeholder }}</label>
            <span class="focus-border"></span>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'CustomInput',
        data() {
            return {
                currentValue: '',
            };
        },
        props: {
            type: {
                type: String,
                default: 'text',
            },
            placeholder: {
                type: String,
                default: '',
            },
            value: {
                type: String,
                default: '',
            },
            error: {
                type: String,
                default: '',
            }
        },
        mounted() {
            this.changeValue(this.value);
        },
        methods: {
            changeValue(nextValue: string) {
                this.currentValue = nextValue;
            }
        },
        watch: {
            value(nextValue) {
                this.changeValue(nextValue);
            }
        },
    })
</script>

<style scoped>
    :focus {
        outline: none;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .custom-input {
        width: 100%;
        position: relative;
    }

    .input {
        width: 100%;
        font-size: 18px;
        background-color: transparent;
        color: var(--input-color);
        letter-spacing: 1px;
        padding: 15px 5px 5px 0px;
        border: 0;
        border-bottom: 1px solid var(--input-default-color-border);
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

    .input:focus ~ .placeholder,
    .input:not(:focus):valid ~ .placeholder,
    input[type='date'] ~ .placeholder {
        font-size: 12px;
        color: var(--season-text-color);
        top: 0;
    }

    .input ~ .focus-border{
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: var(--season-text-color);
        transition: .4s;
    }

    .input:focus ~ .focus-border,
    .input:not(:focus):valid ~ .focus-border {
        width: 100%;
        left: 0;
    }

    .error {
        width: 100%;
        font-size: 13px;
        color: var(--error-color);
    }

    .input-container:has(.error) .focus-border {
        background-color: var(--error-color);
    }
</style>
