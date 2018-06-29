class Laser {
	constructor(laserColumn){
		this.xCoordinate = laserColumn;
		this.yCoordinate = 1;
	}
	moveLaser(){
		if(this.yCoordinate == 10){
			$(`.game-square-${this.xCoordinate}-${this.yCoordinate-1}`).removeClass('laser');
		} else {
			$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).addClass('laser');
			$(`.game-square-${this.xCoordinate}-${this.yCoordinate-1}`).removeClass('laser');
			this.yCoordinate += 1;
			this.detectCollision();
			setTimeout(()=>{
				this.moveLaser();
			}, 25)
		}
	}
	detectCollision(){
		const squareAboutToBeLasered = $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`)
		if(squareAboutToBeLasered.hasClass('enemy')){
			squareAboutToBeLasered.removeClass('enemy');
			squareAboutToBeLasered.addClass('explosion');
			setTimeout(()=>{
				squareAboutToBeLasered.removeClass('explosion');
			}, 200)
			enemies.forEach(function(enemy){
				if(enemy.enemyNumber == squareAboutToBeLasered.attr('enemy')){
					console.log("DESTROYED ENEMY " + enemy.enemyNumber);
					squareAboutToBeLasered.removeAttr('enemy');
					enemy.isDestroyed = true;
				}
				
			})
		}
	}
}
const ship = {
	lives: 3,
	xCoordinate: 5,
	attack(){
		const newLaser = new Laser(this.xCoordinate);
		newLaser.moveLaser();
	},
	moveLeft(){
		if(this.xCoordinate > 0){
			console.log("ROOM TO MOVE LEFT")
			$(`.game-square-${this.xCoordinate}-0`).removeClass('ship');
			this.xCoordinate -= 1;
			$(`.game-square-${this.xCoordinate}-0`).addClass('ship')
		}
	},
	moveRight(){
		if(this.xCoordinate < 10){
			console.log("ROOM TO MOVE RIGHT")
			$(`.game-square-${this.xCoordinate}-0`).removeClass('ship');
			this.xCoordinate += 1;
			$(`.game-square-${this.xCoordinate}-0`).addClass('ship')
		}
	}
}
const enemies = [];
let enemyNumber = 1;
class Enemy {
	constructor(xCoordinate){
		this.xCoordinate = xCoordinate;
		this.yCoordinate = 9;
		this.direction = "right";
		this.enemyNumber = enemyNumber;
		this.isDestroyed = false;
		gameBoard[0][xCoordinate] = this;
		$(`.game-square-${xCoordinate}-9`).addClass('enemy');
		$(`.game-square-${xCoordinate}-9`).attr('enemy', enemyNumber);
		enemyNumber++;
		enemies.push(this);
	}
	moveDown(){
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass('enemy')
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeAttr('enemy')
		this.yCoordinate--;
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).addClass('enemy')
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).attr('enemy', this.enemyNumber)
	}
	moveRight(){
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass('enemy')
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeAttr('enemy')
		this.xCoordinate++;
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).addClass('enemy')
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).attr('enemy', this.enemyNumber)
	}
	moveLeft(){
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass('enemy')
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeAttr('enemy')
		this.xCoordinate--;
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).addClass('enemy')
		$(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).attr('enemy', this.enemyNumber)
	}
	move(){
		if(this.isDestroyed){
			console.log("DONT MOVE PUNK")
			return;
		}
		if(this.xCoordinate == 0 && this.direction == "left"){
			this.moveDown();
			this.direction = "right";
		} else if(this.xCoordinate == 10 && this.direction == "right"){
			this.moveDown();
			this.direction = "left";
		}
		else if( this.direction == "right"){
			this.moveRight();
		} else if( this.direction == "left"){
			this.moveLeft();
		}
		setTimeout(()=>{
			this.move()
		}, 1000)
	}
}
const gameBoard = [ [0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,ship,0,0,0,0,0]
]

for(let i = gameBoard.length-1; i >= 0; i--){
	let row = gameBoard[i];
	$('.game-board').append(`<div class='game-row-${i} game-row'></div>`)
	for(let x = 0; x < row.length; x++){
		$(`.game-row-${i}`).append(`<div class="game-square game-square-${x}-${i}"></div>`)
	}
}
$('.game-square-5-0').addClass('ship');
$(document).keydown(function(e){
	let keyPressed = e.which;
	if(keyPressed == 37){
		ship.moveLeft();
	} else if(keyPressed == 39){
		ship.moveRight();
	} else if(keyPressed == 32){
		ship.attack();
	}
})
const lrrr = new Enemy(5);
const enemyAssault = setInterval(function(){
	const newEnemy = new Enemy(5);
	newEnemy.move();
}, 2000)