class Canvas {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
    }
}


class Ladder extends Canvas {
    static defaultOption = {
        width: 400,
        height: 300,
        padding: 60,
        qty: 3,
    }
    /**
     * @param {HTMLElement} el
     */
    constructor(el, option = Ladder.defaultOption) {
        super()
        this.el = el
        this.option = {
            ...Ladder.defaultOption,
            ...(option && option || {}),
        }

        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild)
        }
        this.el.append(this.canvas)
        this.init()
        this.createLadder()
        this.createCicle()
    }
    init() {
        this.canvas.width = this.option.width
        this.canvas.height = this.option.height
        this.ctx.fillStyle = '#63c2e6'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.save()
    }
    calcDistance() {
        this.distance = (this.canvas.width - this.option.padding * 2) / (this.option.qty + 1)
    }
    createLadder() {
        this.calcDistance()
        this.ctx.beginPath()
        this.ctx.strokeStyle = '#22b38c'
        this.ctx.lineWidth = 4

        for (let index = 1; index <= this.option.qty; index++) {
            this.ctx.moveTo(this.distance * index, this.option.padding)
            this.ctx.lineTo(this.distance * index, this.canvas.height - this.option.padding)
        }

        this.ctx.closePath()
        this.ctx.stroke()
    }
    createCicle() {
        this.calcDistance()
        this.ctx.fillStyle = '#22b38c'
        this.ctx.ellipse(this.distance, this.option.padding, 20, 20*0.6, 0, 0, 360)
        this.ctx.fill()
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
