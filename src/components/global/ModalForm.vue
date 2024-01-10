<template>
    <Transition name="bounce">
        <div class="modal-container" v-if="show" @mousedown="close()">
            <form class="modal-content" novalidate @mousedown.stop @submit.prevent="submit()">
                <slot></slot>
            </form>
        </div>
    </Transition>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'ModalForm',
        data() {
            return {
                show: false,
            }
        },
        props: {
            submit: {
                type: Function,
                required: true
            }
        },
        methods: {
            open(start?: Function) {
                (start) && start();
                this.show = true;
                this.$emit('open');
            },
            close(end?: Function) {
                (end) && end();
                this.show = false;
                this.$emit('close');
            },
        },
    })
</script>

<style scoped>
    .modal-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
    }

    .modal-content {
        min-width: 310px;
        max-height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: var(--page-background-color);
        padding: 15px;
        border-radius: 10px;
        opacity: 1;
    }
    
    .bounce-enter-active {
        animation: bounce-in 0.5s;
    }
    .bounce-leave-active {
        animation: bounce-in 0.5s reverse;
    }

    @keyframes bounce-in {
        0% {
            opacity: 0;
        }
        50% {
            transform: scale(1.25);
        }
        100% {
            opacity: 1;
        }
    }
</style>
