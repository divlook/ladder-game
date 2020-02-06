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
    const { width, height, lineIndex, map } = props

    const [state, setState] = useState<ResultCanvasState>(() => {
        return {
            coordinates: [],
            lineWidth: 3,
            animations: [],
        }
    })

    useEffect(() => {
        calcCoordinates()
    }, [width, height, lineIndex, map])

    useEffect(() => {
        makeAnimations()
    }, [state.coordinates])

    useEffect(() => {
        drawCanvas(true)
    }, [state.animations])

    const calcCoordinates = useCallback(() => {
        const nextCoordinates: Waypoint[] = []
        let prevBlockUid = 0
        let current: MapData | null = map[lineIndex][0]

        while (current !== null) {
            let next: MapData | null = null
            if (current.nextBlock) {
                if (nextCoordinates.length === 0) {
                    // 시작
                    nextCoordinates.push([
                        (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - state.lineWidth) / 2,
                        current.el?.offsetTop || 0,
                    ])

                    next = current.nextBlock
                } else if (current.linkedBlock) {
                    if (current.isHandle) {
                        nextCoordinates.push([
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
                nextCoordinates.push([
                    (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - state.lineWidth) / 2,
                    (current.el?.offsetTop || 0) + (current.el?.offsetHeight || 0),
                ])
            }

            prevBlockUid = current?.uid || 0
            current = next
        }

        setState(prevState => {
            return {
                ...prevState,
                coordinates: [...nextCoordinates],
            }
        })
    }, [lineIndex, map])

    const makeAnimations = useCallback(() => {
        if (!canvasRef.current || !width || !height) return

        canvasRef.current.width = width
        canvasRef.current.height = height

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const color = colors[lineIndex % colors.length]

        if (!ctx) return

        const lastIndex = state.coordinates.length - 1
        const waypointMapper = ([prev, next]: [Waypoint, Waypoint]) => (isEnd) => {
            ctx.lineTo(...next)
            isEnd && ctx.stroke()
        }

        ctx.lineWidth = state.lineWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = color
        ctx.fillStyle = color

        const animations = state.coordinates.reduce((result: AnimationCallback[], currentCoordinate, index) => {
            const prevCoordinate = state.coordinates[index - 1]

            if (index === 0) {
                result.push(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.beginPath()
                    ctx.arc(currentCoordinate[0], currentCoordinate[1] - 8, 6, 0, Math.PI * 2)
                    ctx.closePath()
                    ctx.fill()
                    ctx.beginPath()
                })

                result = result.concat(calcWaypoints([currentCoordinate[0], currentCoordinate[1] - 3], currentCoordinate).map(waypointMapper))
            }

            if (prevCoordinate) {
                result = result.concat(calcWaypoints(prevCoordinate, currentCoordinate).map(waypointMapper))
            }

            if (index === lastIndex) {
                result = result.concat(calcWaypoints(currentCoordinate, [currentCoordinate[0], currentCoordinate[1] + 3]).map(waypointMapper))
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

        setState(prevState => ({
            ...prevState,
            animations: [...animations],
        }))
    }, [state.lineWidth, state.coordinates, width, height, lineIndex])

    function calcWaypoints(start: number[], end: number[]) {
        const waypoints: [Waypoint, Waypoint][] = []
        const dx = end[0] - start[0]
        const dy = end[1] - start[1]
        const frames = Math.round(Math.cbrt(Math.pow(Math.abs(dx), 2) + Math.pow(Math.abs(dy), 2))) * 1.2

        let prevWaypoint: Waypoint | null = null

        for (let i = 0; i < frames; i++) {
            const x = start[0] + (dx * i) / frames
            const y = start[1] + (dy * i) / frames
            const waypoint: Waypoint = [x, y]
            if (prevWaypoint) waypoints.push([prevWaypoint, waypoint])
            prevWaypoint = waypoint
        }

        return waypoints
    }

    const drawCanvas = useCallback((useAnimation = false, playIndex = 0) => {
        for (const index in state.animations) {
            const isEnd = playIndex <= index
            const animationCallback = state.animations[index]
            animationCallback?.(isEnd)
            if (isEnd) break
        }

        playIndex++

        if (useAnimation) {
            requestAnimationFrame(() => drawCanvas(useAnimation, playIndex))
        } else {
            drawCanvas(useAnimation, playIndex)
        }
    }, [state.animations])

    return <canvas ref={canvasRef} width={width} height={height} />
}

export default ResultCanvas
