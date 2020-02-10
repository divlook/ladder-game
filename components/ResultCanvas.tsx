import React, { useRef, useEffect, useState, useCallback } from 'react'
import { MapData } from '~/components/LadderGame.interface'
import { colors } from '~/components/LadderGame.style'

interface ResultCanvasProps {
    lineIndex: number
    width: number
    height: number
    map: MapData[][]
}

interface ResultCanvasState {
    coordinates: Waypoint[]
    lineWidth: number
    animations: AnimationCallback[]
}

type Waypoint = [number, number]
type AnimationCallback = (isEnd: boolean) => void

const ResultCanvas: React.FC<ResultCanvasProps> = props => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mounted, setMount] = useState(false)
    const [state, setState] = useState<ResultCanvasState>(() => {
        return {
            coordinates: [],
            lineWidth: 3,
            animations: [],
        }
    })

    useEffect(() => {
        const { stopAnimation } = drawCanvas(true)
        setMount(true)

        return () => {
            stopAnimation()
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            drawCanvas()
        }
    }, [props])

    const drawCanvas = useCallback((isManual = false) => {
        const coordinates = calcCoordinates()
        const animations = makeAnimations(coordinates)

        setState(prevState => ({
            ...prevState,
            animations,
            coordinates,
        }))

        return playAnimation(animations, isManual)
    }, [])

    const calcCoordinates = useCallback(() => {
        const coordinates: Waypoint[] = []
        let prevBlockUid = 0
        let current: MapData | null = props.map[props.lineIndex][0]

        while (current !== null) {
            let next: MapData | null = null
            if (current.nextBlock) {
                if (coordinates.length === 0) {
                    // 시작
                    coordinates.push([
                        (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - state.lineWidth) / 2,
                        current.el?.offsetTop || 0,
                    ])

                    next = current.nextBlock
                } else if (current.linkedBlock) {
                    if (current.isHandle) {
                        coordinates.push([
                            (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - state.lineWidth) / 2,
                            (current.el?.offsetTop || 0) + (current.el?.offsetHeight || 0 - state.lineWidth) / 2,
                        ])
                    }

                    if (current.linkedBlock.uid === prevBlockUid) {
                        // midLine 이동 후
                        next = current.nextBlock
                    } else {
                        // midLine 이동 전
                        next = current.linkedBlock
                    }
                } else {
                    // 일반 block
                    next = current.nextBlock
                }
            } else {
                // 끝
                coordinates.push([
                    (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - state.lineWidth) / 2,
                    (current.el?.offsetTop || 0) + (current.el?.offsetHeight || 0),
                ])
            }

            prevBlockUid = current?.uid || 0
            current = next
        }

        return coordinates
    }, [props.map, props.lineIndex, state.lineWidth])

    const makeAnimations = useCallback(
        (coordinates = state.coordinates) => {
            if (!canvasRef.current || !props.width || !props.height) return []

            canvasRef.current.width = props.width
            canvasRef.current.height = props.height

            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const color = colors[props.lineIndex % colors.length]

            if (!ctx) return []

            const lastIndex = coordinates.length - 1
            const waypointMapper = (waypoint: Waypoint) => isEnd => {
                ctx.lineTo(...waypoint)
                isEnd && ctx.stroke()
            }

            ctx.lineWidth = state.lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.strokeStyle = color
            ctx.fillStyle = color

            const animations = coordinates.reduce((result: AnimationCallback[], currentCoordinate, index) => {
                const prevCoordinate = coordinates[index - 1]

                if (index === 0) {
                    result.push(() => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        ctx.beginPath()
                        ctx.arc(currentCoordinate[0], currentCoordinate[1] - 8, 6, 0, Math.PI * 2)
                        ctx.closePath()
                        ctx.fill()
                        ctx.beginPath()
                    })

                    result = result.concat(
                        calcWaypoints([currentCoordinate[0], currentCoordinate[1] - 3], currentCoordinate).map(waypointMapper)
                    )
                }

                if (prevCoordinate) {
                    result = result.concat(calcWaypoints(prevCoordinate, currentCoordinate).map(waypointMapper))
                }

                if (index === lastIndex) {
                    result = result.concat(
                        calcWaypoints(currentCoordinate, [currentCoordinate[0], currentCoordinate[1] + 3]).map(waypointMapper)
                    )
                    result.push(() => {
                        ctx.stroke()
                        ctx.closePath()
                        ctx.beginPath()
                        ctx.arc(currentCoordinate[0], currentCoordinate[1] + 8, 6, 0, Math.PI * 2)
                        ctx.closePath()
                        ctx.fill()
                    })
                }

                return result
            }, [])

            return animations
        },
        [props, state.coordinates, state.lineWidth]
    )

    const calcWaypoints = useCallback((start: number[], end: number[]) => {
        const waypoints: Waypoint[] = []
        const dx = end[0] - start[0]
        const dy = end[1] - start[1]
        const frames = Math.round(Math.sqrt(Math.pow(Math.abs(dx), 2) + Math.pow(Math.abs(dy), 2)) / 10)

        for (let i = 0; i <= frames; i++) {
            const x = start[0] + (dx * i) / frames
            const y = start[1] + (dy * i) / frames

            waypoints.push([x, y])
        }

        return waypoints
    }, [])

    const playAnimation = useCallback(
        (animations: AnimationCallback[], useAnimation = false, playAnimationState = { playing: true, playIndex: 0 }) => {
            for (const index in animations) {
                const isEnd = useAnimation && playAnimationState.playIndex <= Number(index)
                const animationCallback = animations[index]
                animationCallback?.(isEnd)
                if (isEnd) break
            }

            playAnimationState.playIndex++

            if (playAnimationState.playing && useAnimation && playAnimationState.playIndex < animations.length) {
                requestAnimationFrame(() => playAnimation(animations, useAnimation, playAnimationState))
            }

            return {
                stopAnimation() {
                    playAnimationState.playing = false
                },
            }
        },
        []
    )

    return <canvas ref={canvasRef} width={props.width} height={props.height} />
}

export default ResultCanvas
