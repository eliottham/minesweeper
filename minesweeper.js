$(document).ready(function() {
	var grid = makeGrid(9);
	grid[3][2] = new Square([3, 2]);
	grid[3][1] = new Bomb();

	console.log(grid[3][2].touching);
	grid[3][2].findBombs(grid);
	console.log(grid[3][2].touching);

});

var surrounding = [ [-1, 1], [0, 1],   [1, 1],  [-1, 0],
                    [1, 0],  [-1, -1], [0, -1], [1, -1] ];

function makeGrid(size) {
	grid = new Array(size);
	for(var i = 0; i < size; i++) {
		grid[i] = new Array(size);
	}
	for(var i = 0; i < size; i++) {
		for(var j = 0; j < size; j++) {
			grid[i][j] = new Square([i, j]);
		}
	}
	return grid;
}

function Bomb() {
	this.active = true;
}

function Square(position) {
	this.position = position;
	this.touching = 0;
}

Square.prototype.findBombs = function(grid) {
	var that = this;
	surrounding.forEach(function(coord) {
		if((grid[that.position[0] + coord[0]][that.position[1] + coord[1]]).constructor === Bomb) {
			that.touching++;
		}
	});
};