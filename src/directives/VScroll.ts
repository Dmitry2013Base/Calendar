export default {
    mounted(el: HTMLElement) {
        el.addEventListener("scroll", () => parallelScroll(el));
    },
    unmounted(el: HTMLElement) {
        el.removeEventListener("scroll", () => parallelScroll(el));
    }
}

const parallelScroll = (el: HTMLElement) => document.querySelectorAll(`.${el.classList[0]}`).forEach(e => e.scrollLeft = el.scrollLeft);
