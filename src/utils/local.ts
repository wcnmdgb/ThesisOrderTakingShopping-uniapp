/* eslint-disable */
export const intoData = (obj: object) => {
    for (const key in obj) {
        const val = (obj as any)[key]
        // localStorage.setItem(key, val)
        uni.setStorageSync(key, val)
    }
}

export const findData = (...key: any[]) => {

    if (key.length === 1) {
        // return localStorage.getItem(key[0])
        return uni.getStorageSync(key[0])

    } else {

        for (const item of key) {
            // karr.push(localStorage.getItem(item))
            return uni.getStorageSync(key[item]);
        }


    }
}


export const delData = (...key: any[]) => {
    for (const i in key) {

        // localStorage.removeItem(key[i])

        uni.removeStorage(key[1])
    }
}

export const cleanData = () => {
    localStorage.clear()
}


