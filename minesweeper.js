$(document).ready(function() {
	var grid = makeGrid(9);

	render(grid);

});

var surrounding = [ [-1, 1], [0, 1],   [1, 1],  [-1, 0],
                    [1, 0],  [-1, -1], [0, -1], [1, -1] ];

function makeGrid(size) {
	var grid = new Array(size);
	
	for(var i = 0; i < size; i++) {
		grid[i] = new Array(size);
		for(var j = 0; j < size; j++) {
			grid[i][j] = new Square([i, j]);
		}
	}
	
	for(var i = 0; i < 11; i++) {
		var x = Math.floor(Math.random() * size);
		var y = Math.floor(Math.random() * size);
		grid[x][y] = new Bomb();
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
	for(var i = 0; i < grid.length; i++) {
		for(var j = 0; j <= grid.length; j++) {
			if(j == grid.length) {
				$('#grid').append('<div class="row"></div>');
			}
			else { 
				$('#grid').append('<div class="box">' + grid[i][j].touching + '</div>')
			}
		}
	}
}

function Bomb() {
	this.active = true;
	this.touching = 'B';
}

function Square(position) {
	this.position = position;
	this.touching = 0;
}

Square.prototype.findBombs = function(grid) {
	var that = this;
	surrounding.forEach(function(coord) {
		var x = that.position[0] + coord[0];
		var y = that.position[1] + coord[1];
		if((x >= 0 && x < grid.length) && (y >= 0 && y < grid.length)) {
			if(grid[x][y].constructor === Bomb) {
				that.touching++;
			}
		}
	});
};