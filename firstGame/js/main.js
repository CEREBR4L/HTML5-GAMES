var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms, player, scoreText, cursors, stars;
var score = 0; 

/* Phaser Functions */

function preload() {

	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.sprite(0, 0, 'sky');

	platforms = game.add.group();
	platforms.enableBody = true;

	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2,2);
	ground.body.immovable = true; 

	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(475, 100, 'ground');
	ledge.body.immovable = true;

	player = game.add.sprite(32, game.world.height - 150, 'dude');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	stars = game.add.group();
	stars.enableBody = true;
	generateStars();

	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '1em', fill: '#000' });

	cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	game.physics.arcade.collide(player, platforms);

	player.body.velocity.x = 0;

	if(cursors.left.isDown){

		player.body.velocity.x = -150;
		player.animations.play('left');

	}
	else if(cursors.right.isDown){

		player.body.velocity.x = 150;
		player.animations.play('right');

	}
	else{

		player.animations.stop();
		player.frame = 4;

	}

	if(cursors.up.isDown && player.body.touching.down){
		player.body.velocity.y = -350;
	}

	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	reset();

}

/* Custom Functions */

function collectStar(player, star){
	
	star.kill();

	score += 10;
	scoreText.text = "Score: " + score;

}

function reset(){
	if (score === 160) {
		score = 0;
		create();
	}
}

function generateStars(){
	if (score === 0) {
		for(var i = 0; i < 16; i++){

			var star = stars.create(i * 50, 0 + Math.random() * 300, 'star');
			star.body.gravity.y = 300;
			star.body.bounce.y = 0.3 + Math.random() * 0.2;

		}
	}
}
