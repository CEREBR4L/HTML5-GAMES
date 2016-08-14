var game = new Phaser.Game(1200, 750, Phaser.AUTO, '', 
							{ 
								preload: preload, 
								create: create, 
								update: update 
							});

var platforms, player, cursors, danger, deathsText, goods, goodText;
var deaths = 0;
var deathsDisplay = "Deaths: 0";

var collectedGoods = 0;

function preload(){

	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/ground.png');
	game.load.image('boop', 'assets/danger.png');
	game.load.image('good', 'assets/jiggy.png');

	game.load.spritesheet('blob', 'assets/blob.png', 50, 50);

}

function create(){

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.sprite(0, 0, 'sky');

	platforms = game.add.group();
	platforms.enableBody = true;

	var ground = platforms.create(0, game.world.height - 100, 'ground');
	ground.body.immovable = true;

	danger = game.add.group();
	danger.enableBody = true;

	var boop = danger.create(game.world.width * .5 - 75, game.world.height - 250,  'boop');

	goods = game.add.group();
	goods.enableBody = true;

	for(i = 0; i < 11; i++){
		var good = goods.create(i * 115, 0 + Math.random() * 300, 'good');
		good.body.gravity.y = 300;
		good.body.bounce.y = 0.3 + Math.random() * 0.2;
	}


	player = game.add.sprite(32, game.world.height - 200, 'blob');
	game.physics.arcade.enable(player);
	player.body.gravity.y = 100;
	player.body.collideWorldBounds = true;
	player.animations.add('left', [0, 1, 0], 10, true);
	player.animations.add('right', [3, 4, 3], 10, true);

	cursors = game.input.keyboard.createCursorKeys();

	deathsText = game.add.text(game.world.width - 150, 16, deathsDisplay, { fontSize: '1em', fill: '#000' });
	goodText = game.add.text(16, 16, 'Jiggy Goods: 0', { fontSize: '1em', fill: '#000' });

}

function update(){

	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(goods, platforms);

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
		player.frame = 2;

	}


	if(cursors.up.isDown && player.body.touching.down){

		player.body.velocity.y = -250;

	}

	game.physics.arcade.overlap(player, danger, killPlayer, null, this);
	game.physics.arcade.overlap(goods, danger, killGood, null, this);
	game.physics.arcade.overlap(player, goods, collectGood, null, this);

	if(collectedGoods === 10){
		reset();
	}

}

function killPlayer(){

	deaths++;
	deathsDisplay = "Deaths: " + deaths;

	collectedGoods = 0;

	create();

}

function killGood(good, danger){

	good.kill();

}

function collectGood(player, good){

	good.kill();

	collectedGoods++;
	goodText.text = "Jiggy Goods: " + collectedGoods;

}

function reset(){

	deaths = 0;
	deathsDisplay = "Deaths: " + deaths;

	collectedGoods = 0;

	create();

}
