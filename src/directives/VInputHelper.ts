import { capitalizeFirstLetter } from "@/data/actions";

export default {
    mounted(el: HTMLElement, { value }: any) {
        el.addEventListener("input", () => input(el, value?.array));
    },
    unmounted(el: HTMLElement, { value }: any) {
        el.removeEventListener("input", () => input(el, value?.array));
    }
}

let last = '';
const input = (el: HTMLElement, array: Array<string> = []) => {
    let flag = true;
    let text = (el as HTMLInputElement).value;
    let item = array.map(e => e.toLowerCase()).find(e => e.startsWith(text.toLowerCase()));
    if (last.length >= text.length) {
        if (!flag) {
            (el as HTMLInputElement).value = text;
            flag = false;
        }
    } else {
        if (flag && typeof(item) !== 'undefined') {
            (el as HTMLInputElement).value = capitalizeFirstLetter(item);
            (el as HTMLInputElement).setSelectionRange(text.length, item.length);
        }
        flag = true;
    }
    last = text;
}
