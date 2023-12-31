import store from "@/store";

const toast = {
    type: "error",
    message: "",
}

export const tryFun = async (fn: Function, fina: Function, errMsg: string) => {
    try {
        await fn();
    } catch (e) {
        toast.message = errMsg;
        store.commit('setToast', toast);

    } finally {
        await fina();
    }
}