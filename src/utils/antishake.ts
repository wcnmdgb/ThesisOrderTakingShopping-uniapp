
import { ref } from "vue";

export const debouncedFn = ref<number>();

export const debounce = (fn: Function, delay: number) => {
    if (debouncedFn.value) {
        clearTimeout(debouncedFn.value);
    }
    debouncedFn.value = setTimeout(fn, delay);
};
