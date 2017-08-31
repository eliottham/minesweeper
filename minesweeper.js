$(document).ready(function() {
	var grid = makeGrid(9);
	render(grid);


$('#grid').on('mousedown', '.box', function(event) {
	switch(event.which) {
		case 1:
			if($(this).data('object') instanceof Bomb) {
				$(this).data('object').show = true;
			}
			else {
				$(this).data('object').showSquare(grid);
			}
			render(grid);
			break;
		case 3:
			event.preventDefault();
			$(this).data('object').setFlag();
			render(grid);
		}
	});

});

var surrounding = [ [-1, 1], [0, 1],   [1, 1],  [-1, 0],
                    [1, 0],  [-1, -1], [0, -1], [1, -1] ];

var bombs = [];

flags = 9;

function makeGrid(size) {
	var grid = new Array(size);
	var mines = Math.floor((size * size) / 4);
	
	for(var i = 0; i < size; i++) {
		grid[i] = new Array(size);
		for(var j = 0; j < size; j++) {
			grid[i][j] = new Square([i, j]);
		}
	}
	
	for(var i = 0; i < mines; i++) {
		var x = Math.floor(Math.random() * size);
		var y = Math.floor(Math.random() * size);
		grid[x][y] = new Bomb();
		bombs.push(grid[x][y]);
	}

	for(var i = 0; i < size; i++) {
		for(var j = 0; j < size; j++) {
			if(grid[i][j] instanceof Square) {
				grid[i][j].findBombs(grid);
			}
		}
	}

	return grid;
}

function render(grid) {
	$('#grid').empty();
	for(var i = 0; i < grid.length; i++) {
		for(var j = 0; j <= grid.length; j++) {
			if(j == grid.length) {
				$('#grid').append('<div class="row"></div>');
				break;
			}
			var $box = $('<div class="box"></div>');
			$box.data('object', grid[i][j]);
			showBox($box);
			$('#grid').append($box);
		}
	}
}

function showBox($box) {
	var object = $box.data('object');
	
	if(object.flag) { return $box.html('>') };
	
	if(object.show) {
		$box.html(object.display());
		object instanceof Square ? $box.addClass(object.cssClass()) : $box.addClass('bomb');
	}
}


function Bomb() {
	this.prototype = new Square();
	this.flag = false;
	this.show = false;
	this.display = function() { return '*' };
}

Bomb.prototype.setFlag = function() {
	if(!this.flag && !this.show) {
		this.flag = true;
		flags--;
	}
	else {
		this.flag = false;
		flags++;
	}
};

function Square(position) {
	this.position = position;
	this.touching = 0;
	this.show = false;
	this.flag = false;
}

Square.prototype.setFlag = function() {
	if(!this.flag && !this.show) {
		this.flag = true;
		flags--;
	}
	else {
		this.flag = false;
		flags++;
	}
};

Square.prototype.findBombs = function(grid) {
	var that = this;
	surrounding.forEach(function(coord) {
		var x = that.position[0] + coord[0];
		var y = that.position[1] + coord[1];
		if((x >= 0 && x < grid.length) && (y >= 0 && y < grid.length)) {
			if(grid[x][y] instanceof Bomb) {
				that.touching++;
			}
		}
	});
};

Square.prototype.showSquare = function(grid) {
	this.show = true;
	if(this.touching == 0) {
		var that = this;
		surrounding.forEach(function(coord) {
			var x = that.position[0] + coord[0];
			var y = that.position[1] + coord[1];
			if((x >= 0 && x < grid.length) && (y >= 0 && y < grid.length)) {
				if(grid[x][y] instanceof Square && grid[x][y].show == false) {
					return grid[x][y].showSquare(grid);
				}
			}
		});
	}
};

Square.prototype.display = function() {
	if(this.touching == 0) {
		return '';
	}
	else {
		return this.touching;
	}
};

Square.prototype.cssClass = function() {
	return 'show-' + this.touching;
}

