<template>
    <Transition name="fade">
        <div class="notification-container" v-show="isVisible">
            <div class="notification">{{ text }}</div>
        </div>
    </Transition>
</template>

<script lang="ts">
    import { defineComponent, type PropType } from 'vue';


    export default defineComponent({
        name: 'Notification',
        data() {
            return {
                timerId: 0,
                isVisible: false,
            };
        },
        props: {
            text: {
                type: String as PropType<string | undefined>,
                required: false,
            },
            selector: {
                type: Boolean as PropType<boolean>,
                default: false
            }
        },
        watch: {
            isVisible(nextValue) {
                if (!nextValue) {
                    clearTimeout(this.timerId);
                    this.timerId = 0;
                }
            },
            selector() {
                if (this.timerId === 0) {
                    this.isVisible = true;
                    this.timerId = setTimeout(() => { this.isVisible = false }, 5000);
                } 
            }
        },
    })
</script>

<style scoped>
    .notification-container {
        width: 100vw;
        height: 100vh;
        position: fixed;
        background-color: transparent;
        z-index: 100000000;
        pointer-events: none;
    }

    .notification {
        width: fit-content;
        text-align: center;
        padding: 5px 10px;
        border-radius: 40px;
        background-color: var(--season-backgroung-color);
        color: #000;
        font-size: 20px;
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
    }

    .fade-leave-active {
        transition: opacity 1s ease-in;
    }

    .fade-leave-to {
        opacity: 0;
    }
</style>
