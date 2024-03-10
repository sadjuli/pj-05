class Snake {
	#xMax= 10
	#yMax= 10
	#speed = 500
	#score = 0
	#direction = 'up'
	#appleCoords = []
	#snakeCoords = []
	#snakeTimeout = null
	#gameStatus = 'stopped'

	#snakeElId = 'snake'
	#scoreElId = 'score'
	#topElId = 'top'
	#startPauseButtonId = 'start-pause'
	#restartButtonId = 'restart'

	#snakeElClass = 'snake__el--snake'
	#appleElClass = 'snake__el--apple'
	#snakeStoppedClass = 'snake--stopped'

	constructor() {
		this.#handleKeyboardEvents()
	}

	#randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}
	#setDirection(value) {
		const snakeLength = this.#snakeCoords.length
		if (value === this.#direction) {
			return
		}
		if (snakeLength > 1) {
			if (value === 'up' && this.#direction === 'down') {
				return
			}
			if (value === 'down' && this.#direction === 'up') {
				return
			}
			if (value === 'left' && this.#direction === 'right') {
				return
			}
			if (value === 'right' && this.#direction === 'left') {
				return
			}
		}
		this.#direction = value
	}
	#handleKeyboardEvents() {
		document.addEventListener('keyup', (e) => {
			switch (e.key) {
				case 'ArrowUp':
					this.#setDirection('up')
					break
				case 'ArrowDown':
					this.#setDirection('down')
					break
				case 'ArrowLeft':
					this.#setDirection('left')
					break
				case 'ArrowRight':
					this.#setDirection('right')
					break
				default:
			}
		})
	}
	init() {
		const snakeEl = document.getElementById(this.#snakeElId)
		for (let i = 0; i < this.#xMax; i++) {
			for (let j = 0; j < this.#yMax; j++) {
				const snakeFieldEl = document.createElement('div')
				snakeFieldEl.className = 'snake__el'
				snakeFieldEl.dataset.x = i
				snakeFieldEl.dataset.y = j
				snakeEl.appendChild(snakeFieldEl)
			}
		}
		this.#setApple()
		this.#setSnake()
		this.#showTop()
	}
	#setApple() {
		const x = this.#randomIntFromInterval(0, this.#xMax - 1)
		const y = this.#randomIntFromInterval(0, this.#yMax - 1)
		if (this.#snakeCoords.filter((item) => item.x === x && item.y === y).length) {
			this.#setApple()
			return
		}
		const el = document.querySelector(`.${this.#appleElClass}`)
		if (el) {
			el.classList.remove(this.#appleElClass)
		}
		const appleEl = document.querySelector(`.snake__el[data-x="${x}"][data-y="${y}"]`)
		appleEl.classList.add(this.#appleElClass)
		this.#appleCoords = [x, y]
	}
	#setSnake() {
		const x = this.#randomIntFromInterval(3, this.#xMax - 3)
		const y = this.#randomIntFromInterval(3, this.#yMax - 3)
		if (x === this.#appleCoords[0] && y === this.#appleCoords[1]) {
			this.#setSnake()
			return
		}
		this.#snakeCoords.push({ x, y })
	}
	#drawSnake() {
		const snakeEls = document.querySelectorAll(`.${this.#snakeElClass}`)
		const snakeElsArr = [...snakeEls]
		snakeElsArr.forEach((item) => {
			item.classList.remove(this.#snakeElClass)
		})
		this.#snakeCoords.forEach((item) => {
			const snakeEl = document.querySelector(`.snake__el[data-x="${item.x}"][data-y="${item.y}"]`)
			snakeEl.classList.add(this.#snakeElClass)
		})
	}
	#updateScore() {
		this.#score++
		const scoreEl = document.getElementById(this.#scoreElId)
		scoreEl.textContent = this.#score
	}
	startGame() {
		if (this.#gameStatus === 'started') {
			this.#pauseGame()
			return
		}

		const startPauseButtonEl = document.getElementById(this.#startPauseButtonId)
		startPauseButtonEl.textContent = '⏸︎'

		const restartButtonEl = document.getElementById(this.#restartButtonId)
		restartButtonEl.removeAttribute('disabled')

		this.#gameStatus = 'started'

		const snakeEl = document.getElementById(this.#snakeElId)
		snakeEl.classList.remove(this.#snakeStoppedClass)

		this.#runSnake()
	}
	#stopGame() {
		const snakeEl = document.getElementById(this.#snakeElId)
		snakeEl.innerHTML = ''
		snakeEl.classList.remove(this.#snakeStoppedClass)

		clearTimeout(this.#snakeTimeout)

		this.#gameStatus = 'stopped'
	}
	restartGame() {
		this.#stopGame()

		const startPauseButtonEl = document.getElementById(this.#startPauseButtonId)
		startPauseButtonEl.textContent = '⏸︎'

		this.#appleCoords = []
		this.#snakeCoords = []

		this.#setDirection('up')
		this.#setSpeed(500)

		this.init()

		this.startGame()
	}
	#pauseGame() {
		if (this.#gameStatus === 'stopped') {
			this.startGame()
			return
		}

		const startPauseButtonEl = document.getElementById(this.#startPauseButtonId)
		startPauseButtonEl.textContent = '►'

		const restartButtonEl = document.getElementById(this.#restartButtonId)
		restartButtonEl.removeAttribute('disabled')

		this.#gameStatus = 'stopped'

		const snakeEl = document.getElementById(this.#snakeElId)
		snakeEl.classList.add(this.#snakeStoppedClass)

		clearTimeout(this.#snakeTimeout)

		let scores = localStorage.getItem('snake_scores')
		if (scores) {
			scores = JSON.parse(scores)
		} else {
			scores = []
		}
		if (this.#score && !scores.includes(this.#score)) {
			scores.push(this.#score)
		}
		localStorage.setItem('snake_scores', JSON.stringify(scores))
		this.#score = 0

		this.#showTop()
	}
	#setSpeed(value) {
		this.#speed = value
	}
	#showTop() {
		let storedScores = localStorage.getItem('snake_scores')
		if (storedScores) {
			storedScores = JSON.parse(storedScores).sort((a, b) => b - a)
			if (storedScores.length) {
				const topEl = document.getElementById(this.#topElId)
				topEl.innerHTML = storedScores[0]
			}
		}
	}
	#runSnake() {
		const snakeFirstEl = this.#snakeCoords[0]
		const snakeNewFirstEl = {}
		switch (this.#direction) {
			case 'up':
				snakeNewFirstEl.y = snakeFirstEl.y
				snakeNewFirstEl.x = snakeFirstEl.x === 0 ?  this.#xMax - 1 : snakeFirstEl.x - 1
				break
			case 'down':
				snakeNewFirstEl.x = snakeFirstEl.x === this.#xMax - 1 ? 0 : snakeFirstEl.x + 1
				snakeNewFirstEl.y = snakeFirstEl.y
				break
			case 'left':
				snakeNewFirstEl.x = snakeFirstEl.x
				snakeNewFirstEl.y = snakeFirstEl.y === 0 ? this.#yMax - 1 : snakeFirstEl.y - 1
				break
			case 'right':
				snakeNewFirstEl.x = snakeFirstEl.x
				snakeNewFirstEl.y = snakeFirstEl.y === this.#yMax - 1 ? 0 : snakeFirstEl.y + 1
				break
			default:
		}
		if (this.#snakeCoords.find((item) => item.x === snakeNewFirstEl.x & item.y === snakeNewFirstEl.y)) {
			alert('Game Over')
			this.#pauseGame()
			return
		}
		if (snakeFirstEl.x === 0 && snakeNewFirstEl.x === this.#xMax - 1) {
			alert('Game Over')
			this.#pauseGame()
			return
		}
		if (snakeFirstEl.x === this.#xMax - 1 && snakeNewFirstEl.x === 0) {
			alert('Game Over')
			this.#pauseGame()
			return
		}
		if (snakeFirstEl.y === 0 && snakeNewFirstEl.y === this.#yMax - 1) {
			alert('Game Over')
			this.#pauseGame()
			return
		}
		if (snakeFirstEl.y === this.#yMax - 1 && snakeNewFirstEl.y === 0) {
			alert('Game Over')
			this.#pauseGame()
			return
		}
		this.#snakeCoords.unshift(snakeNewFirstEl)
		this.#snakeCoords.pop()

		if (snakeNewFirstEl.x === this.#appleCoords[0] && snakeNewFirstEl.y === this.#appleCoords[1]) {
			this.#snakeCoords.push({ x: this.#appleCoords[0], y: this.#appleCoords[1] })
			this.#setApple()
			this.#updateScore()
			this.#setSpeed(this.#speed - (this.#speed / 10))
		}

		this.#drawSnake()
		this.#snakeTimeout = setTimeout(() => this.#runSnake(), this.#speed)
	}
}

let snake

const startGame = () => {
	if (!snake) {
		return
	}
	snake.startGame()
}
const restartGame = () => {
	if (!snake) {
		return
	}
	snake.restartGame()
}
document.addEventListener('DOMContentLoaded', () => {
	snake = new Snake()
	snake.init()
})
