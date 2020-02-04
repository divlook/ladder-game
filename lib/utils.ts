export const throttling = (cb: Function, distance = 100) => {
    let prevTime = 0
    let timeout = 0
    return () => {
        const nowTime = Date.now()
        if (prevTime && nowTime - prevTime < distance) {
            clearTimeout(timeout)
            timeout = window.setTimeout(() => {
                prevTime = nowTime
                cb?.()
            }, distance)
        } else {
            prevTime = nowTime
            cb?.()
        }
    }
}
