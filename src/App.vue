<script setup lang="ts">
    import { RouterView } from 'vue-router';
</script>

<template>
    <CustomHeader
        :class="season"
        @click="burgerSelector = !burgerSelector;"
        :burgerSelector="burgerSelector"
        :routeName="routeName"/>
    <RouterView v-slot="{ Component, route }">
        <Transition :name="transitionName">
            <component
                :is="Component"
                :key="route.path" 
                :class="['page', season]"
                @click="burgerSelector = !burgerSelector;"/>
        </Transition>
    </RouterView>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { current, months } from '@/data';


    export default defineComponent ({
        data() {
            return {
                routeName: '',
                transitionName: '',
                burgerSelector: false,
                season: months[current.getMonth()].season,
            }
        },
        watch: {
            $route(to, from) {
                this.routeName = to.name;
                if (typeof(from.name) === 'undefined') return;

                let swipeLeft = 'swipe-left';
                let swipeRight = 'swipe-right';

                const getDirectionByParam = (param: string) => Number(from.params[param]) < Number(to.params[param]);
                const getDirectionByPage = () => {
                    if (from.name === 'year') return true;
                    else if (from.name === 'month') {
                        if (to.name === 'day') return true;
                        else if (to.name === 'year') return false;
                    }
                    else if (from.name === 'day') return false;
                    else return false;
                };

                this.transitionName = (from.name === to.name) ? (getDirectionByParam(from.name) ? swipeLeft : swipeRight) : (getDirectionByPage() ? swipeLeft : swipeRight);
            }
        }
    })
</script>

<style>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    html {
        background-color: var(--page-background-color);
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-color) var(--scrollbar-background-color);
    }

    html::-webkit-scrollbar {
        height: 7px;
        width: 7px;
    }

    html::-webkit-scrollbar-track {
        background: var(--scrollbar-background-color);
    }

    html::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
        border-radius: 10px;
        border: 1px solid var(--scrollbar-background-color);
    }

    .page {
        width: 100%;
        min-height: calc(100% - 60px);
        position: absolute;
        background-color: var(--page-background-color);
        color: var(--page-color);
    }

    .swipe-left-enter-active,
    .swipe-left-leave-active,
    .swipe-right-enter-active,
    .swipe-right-leave-active {
        transition: all .8s ease;
    }

    .swipe-left-enter-from {
        right: -100%;
    }

    .swipe-left-enter-to {
        right: 0%;
    }

    .swipe-right-enter-from {
        left: -100%;
    }

    .swipe-right-enter-to {
        left: 0%;
    }

    .swipe-right-leave-from,
    .swipe-left-leave-from {
        transform: scale(1);
    }

    .swipe-right-leave-to,
    .swipe-left-leave-to {
        transform: scale(0.7);
    }
</style>
