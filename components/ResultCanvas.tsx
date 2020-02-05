import React, { useRef, useEffect } from 'react'
import { MapData } from '~/components/LadderGame.interface'
import { colors } from '~/components/LadderGame.style'

interface ResultCanvasProps {
    lineIndex: number
    width: number
    height: number
    map: MapData[][]
}

const ResultCanvas: React.FC<ResultCanvasProps> = props => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { width, height, lineIndex, map } = props

    useEffect(() => {
        drawCanvas(lineIndex)
    }, [])

    useEffect(() => {
        drawCanvas(lineIndex)
    }, [width, height, lineIndex, map])

    function drawCanvas(lineIndex) {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height

        if (!ctx) return

        const coordinates: [number, number][] = []
        const color = colors[lineIndex % colors.length]

        let prevBlockUid = 0
        let current: MapData | null = map[lineIndex][0]

        ctx.lineWidth = 3
        ctx.lineJoin = 'round'
        ctx.strokeStyle = color
        ctx.fillStyle = color

        while (current !== null) {
            let next: MapData | null = null
            if (current.nextBlock) {
                if (coordinates.length === 0) {
                    // 시작
                    coordinates.push([
                        (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - ctx.lineWidth) / 2,
                        current.el?.offsetTop || 0,
                    ])

                    next = current.nextBlock
                } else if (current.linkedBlock) {
                    if (current.isHandle) {
                        coordinates.push([
                            (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - ctx.lineWidth) / 2,
                            (current.el?.offsetTop || 0) + (current.el?.offsetHeight || 0 - ctx.lineWidth) / 2,
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
                    (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - ctx.lineWidth) / 2,
                    (current.el?.offsetTop || 0) + (current.el?.offsetHeight || 0),
                ])
            }

            prevBlockUid = current?.uid || 0
            current = next
        }

        for (let index = 0, len = coordinates.length; index < len; index++) {
            const currentCoordinate = coordinates[index]
            const prevCoordinate = coordinates[index - 1]

            // TODO: 이 사이트 참고해서 애니메이션 작업
            // https://stackoverflow.com/questions/23939588/how-to-animate-drawing-lines-on-canvas

            if (index === 0) {
                ctx.beginPath()
                ctx.arc(currentCoordinate[0], currentCoordinate[1] - 8, 6, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()
                ctx.beginPath()
                ctx.moveTo(currentCoordinate[0], currentCoordinate[1] - 3)
                // ctx.lineTo(...xy)
                calcWaypoints([currentCoordinate[0], currentCoordinate[1] - 3], currentCoordinate, (waypoint: [number, number]) =>
                    ctx.lineTo(...waypoint)
                )
            } else {
                // ctx.lineTo(...currentCoordinate)
                calcWaypoints(prevCoordinate, currentCoordinate, (waypoint: [number, number]) =>
                    ctx.lineTo(...waypoint)
                )
            }

            if (index === len - 1) {
                // ctx.lineTo(currentCoordinate[0], currentCoordinate[1] + 3)
                calcWaypoints(prevCoordinate, [currentCoordinate[0], currentCoordinate[1] + 3], (waypoint: [number, number]) =>
                    ctx.lineTo(...waypoint)
                )
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(currentCoordinate[0], currentCoordinate[1] + 8, 6, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()
            }
        }
    }

    function calcWaypoints(start: number[], end: number[], cb?) {
        const waypoints: [number, number][] = []
        const dx = end[0] - start[0]
        const dy = end[1] - start[1]
        for (let i = 0; i < 100; i++) {
            const x = start[0] + (dx * i) / 100
            const y = start[1] + (dy * i) / 100
            const waypoint: [number, number] = [x, y]
            waypoints.push(waypoint)
            cb?.(waypoint)
        }
        return waypoints
    }

    return <canvas ref={canvasRef} width={width} height={height} />
}

export default ResultCanvas
