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
            const xy = coordinates[index]

            if (index === 0) {
                ctx.beginPath()
                ctx.arc(xy[0], xy[1] - 8, 6, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()
                ctx.beginPath()
                ctx.moveTo(xy[0], xy[1] - 3)
                ctx.lineTo(...xy)
            } else {
                ctx.lineTo(...xy)
            }

            if (index === len - 1) {
                ctx.lineTo(xy[0], xy[1] + 3)
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(xy[0], xy[1] + 8, 6, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()
            }
        }
    }

    return <canvas ref={canvasRef} width={width} height={height} />
}

export default ResultCanvas
