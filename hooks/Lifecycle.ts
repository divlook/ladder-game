import { useState, useEffect } from 'react'

// TODO:
// created mounted 등 필요없다고 판단되어 삭제할 예정
// - 아래 내용 참고해서 로거 함수만 따로 분리 (const logger = new Logger({ display = process?.env.NODE_ENV === 'development', label, color }))
// - nextTick은 쓸만 할 것 같으니 만들어 봅시다
// useLifecycle({ useLog: true, logLabel: 'LadderGame' })


enum Color {
    PersianGreen = '#009688',
}

interface Options {
    created?: (cb) => void
    mounted?: (cb) => void
    updated?: (cb) => void
    beforeDestroy?: (cb) => void
    useLog?: boolean
    logLabel?: string
}

enum HookNames {
    created = 'useCreated',
    mounted = 'useMounted',
    updated = 'useUpdated',
    beforeDestroy = 'useBeforeDestroy',
}

const initialState = {
    created: false,
    mounted: false,
    updated: false,
}

const prevState = {
    ...initialState,
}

// init에서 변형됨
const callbacks = {
    created: [],
    mounted: [],
    updated: [],
    beforeDestroy: [],
}

// init에서 변형됨
const hooks = {
    useCreated: (cb?: any) => void cb,
    useMounted: (cb?: any) => void cb,
    useUpdated: (cb?: any) => void cb,
    useBeforeDestroy: (cb?: any) => void cb,
}

// init에서 변형됨
const run = {
    created: (cb?: any) => void cb,
    mounted: (cb?: any) => void cb,
    updated: (cb?: any) => void cb,
    beforeDestroy: (cb?: any) => void cb,
}

const init = (opt) => {
    const hasArg = opt && typeof opt === 'object'

    for (const lifecycleName in HookNames) {
        const hookName = HookNames[lifecycleName]

        // callback 초기화
        callbacks[lifecycleName] = []

        // 인수가 있으면 callback에 추가
        if (hasArg && typeof opt[lifecycleName] === 'function') {
            callbacks[lifecycleName]?.push?.(opt[lifecycleName])
        }

        // hook을 부를때마다 callback에 추가됨
        hooks[hookName] = cb => void(callbacks[lifecycleName]?.push?.(cb))

        // callback 실행시키는 함수
        run[lifecycleName] = () => callbacks[lifecycleName]?.forEach?.(cb => cb?.())
    }
}

export const useLifecycle = (opt?: Options) => {
    init(opt)

    const [state, setState] = useState(initialState)

    /**
     * beforeCreate
     */
    if (!state.created) {
        setState({
            ...state,
            created: true,
        })
    }

    /**
     * created
     */
    useEffect(() => {
        if (state.created) {
            opt?.useLog && console.group(`%c: Created`, `color: ${Color.PersianGreen}`, opt?.logLabel || '')
            run.created?.()
            opt?.useLog && console.groupEnd()
            if (!state.mounted) {
                setState({
                    ...state,
                    mounted: true,
                })
            }
        }

        prevState.created = state.created
    }, [state.created])

    /**
     * mounted
     */
    useEffect(() => {
        if (state.mounted) {
            opt?.useLog && console.group(`%c: Mounted`, `color: ${Color.PersianGreen}`, opt?.logLabel || '')
            run.mounted?.()
            opt?.useLog && console.groupEnd()
            if (!state.updated) {
                setState({
                    ...state,
                    updated: true,
                })
            }
        }

        prevState.mounted = state.mounted
    }, [state.mounted])

    /**
     * updated
     */
    useEffect(() => {
        const { created, mounted, updated } = state

        if (created && mounted && updated) {
            if (prevState.updated) {
                opt?.useLog && console.group(`%c: Updated`, `color: ${Color.PersianGreen}`, opt?.logLabel || '')
                run.updated?.()
                opt?.useLog && console.groupEnd()
            }

            prevState.updated = true
        }
    })

    /**
     * beforeDestroy
     */
    useEffect(() => {
        return () => {
            if (state.mounted) {
                state.created = false
                state.mounted = false
                state.updated = false

                opt?.useLog && console.group(`%c: beforeDestroy`, `color: ${Color.PersianGreen}`, opt?.logLabel || '')
                run.beforeDestroy?.()
                opt?.useLog && console.groupEnd()

                prevState.created = false
                prevState.mounted = false
                prevState.updated = false
            }
        }
    }, [state.mounted])

    return {
        ...state,
        ...hooks,
    }
}

export default useLifecycle
