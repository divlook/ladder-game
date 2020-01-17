import { useState, useEffect } from 'react'

const prevLifecycle = {
    created: false,
    mounted: false,
    beforeUpdate: false,
}

export const useLifecycle = () => {
    const callbacks = {
        created: () => void 0,
        mounted: () => void 0,
        updated: () => void 0,
    }
    const useCreated = cb => (callbacks.created = cb)
    const useMounted = cb => (callbacks.mounted = cb)
    const useUpdated = cb => (callbacks.updated = cb)
    const [lifecycle, setLifecycle] = useState({
        created: false,
        mounted: false,
        beforeUpdate: false,
    })

    /**
     * beforeCreate
     */
    if (!lifecycle.created) {
        setLifecycle({
            ...lifecycle,
            created: true,
        })
    }

    /**
     * created
     */
    useEffect(() => {
        if (lifecycle.created) {
            callbacks.created?.()
            if (!lifecycle.mounted) {
                setLifecycle({
                    ...lifecycle,
                    mounted: true,
                })
            }
        }

        prevLifecycle.created = lifecycle.created
    }, [lifecycle.created])

    /**
     * mounted
     */
    useEffect(() => {
        if (lifecycle.mounted) {
            callbacks.mounted?.()
            if (!lifecycle.beforeUpdate) {
                setLifecycle({
                    ...lifecycle,
                    beforeUpdate: true,
                })
            }
        }

        prevLifecycle.mounted = lifecycle.mounted
    }, [lifecycle.mounted])

    /**
     * updated
     */
    useEffect(() => {
        const { created, mounted, beforeUpdate } = lifecycle

        if (created && mounted && beforeUpdate) {
            if (prevLifecycle.beforeUpdate) {
                callbacks.updated?.()
            }

            prevLifecycle.beforeUpdate = true
        }
    })

    return {
        ...lifecycle,
        useCreated,
        useMounted,
        useUpdated,
    }
}

export default useLifecycle
