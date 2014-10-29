$(document).ready(function () {

	setUpGrid();
	
	$("#reset").click(function () {
		$('<table><tbody>').empty();
		window.location.reload();
		$('#grid_size').prop('disabled', false);
	
	});
	
	$('#MINE_FIELD').on('click', '.cell', function(e){
		if (e.shiftKey){
			right($(this));
		}else if (e.button == 0){
			left($(this));
		}
	});
});

function setUpGrid(){
	$("#grid_size").click(function () {
		var rows = $("#rowval").val();
		var cols = $("#colval").val();
		var mines = $("#mineval").val();
		var grid_count = rows * cols;
		if(rows > 7 && rows < 31 && cols > 7 && cols < 41){
			if(mines > 0 && mines < grid_count){
				build_grid(cols, rows, mines);
				$('#grid_size').prop('disabled', true); //SETS UP GRID ONCE
				$('#remaining_mines').val(mines);
				return false;
			} else {
				alert ('Invalid amount of mines.');
			}	
		} else {
			alert ('Invalid mine field size. The minimum size should be at least 8x8. The maximum size should be 40 wide by 30 tall.');
		}		
	});
}//////end setupgrid fuction///////

function build_grid(cols, rows, mines){
	var table = $('<table><tbody>').empty();
	var cell_count =0;
	for (var r = 0; r < rows; r++){
		var row = $('<tr></tr>');
		for (var c = 0; c < cols; c++){
			var column=$('<td></td>');
			var button=$('<button class="cell btn btn-lg btn-info" id=' + cell_count + '>&nbsp;</button>');
			if (r == 0){
				button.addClass('above');
			}
			if (r == rows - 1){
				button.addClass('below');
			}
			if (c == 0){
				button.addClass('before');
			}
			if (c == cols - 1){
				button.addClass('after');
			}
			cell_count++;
			column.append(button);
			row.append(column);
		}
		table.append(row);
	}
	$('#MINE_FIELD').append(table); //DRAWS MINE FIELD
	for (var i = 0; i < mines; i++){
		var cellID = Math.floor(Math.random() * (cols * rows));
			var mine = $('#MINE_FIELD').find('#' + cellID);
			if (mine.hasClass('mine')){
				i--;
			}else{
				mine.addClass('mine');
			}		
	}
	for (var i = 0; i < cols * rows; i++){
		var danger_close = 0;
		var cell = $('#MINE_FIELD').find('#' + i);
		var nearby = proximity(cell);
		nearby.forEach(function(entry){
			if ($('#MINE_FIELD').find('#' + entry).hasClass('mine')){
				danger_close++;
			}
		});
		cell.val(danger_close);
	}	
};

function proximity(cell){
	var col = $("#colval").val();
	var nearby = [];
	var i = cell.attr('id');
	if(cell.hasClass('above') && cell.hasClass('before')){
		nearby = [(i * 1+1),(i * 1 + col * 1),(i * 1 + col * 1+1)];
	}else if(cell.hasClass('above') && cell.hasClass('after')){
		nearby = [(i - 1),(i * 1 + col*1),(i * 1 + col * 1-1)];
	}else if(cell.hasClass('below') && cell.hasClass('before')){
		nearby = [(i - col),(i - col + 1),(i * 1+1)];
	}else if(cell.hasClass('below') && cell.hasClass('after')){
		nearby = [(i - col),(i - col - 1),(i - 1)];
	}else if(cell.hasClass('above')){
		nearby = [(i - 1),(i * 1+1),(i * 1 + col * 1),(i * 1 + col * 1-1),(i * 1 + col * 1+1)];
	}else if(cell.hasClass('after')){
		nearby = [(i * 1 + col * 1),(i - col - 1),(i - 1),(i * 1 + col * 1-1),(i - col)];
	}else if(cell.hasClass('below')){
		nearby = [(i * 1+1),(i - col + 1),(i - col),(i - col - 1),(i - 1)];
	}else if(cell.hasClass('before')){
		nearby = [(i * 1 + col * 1),(i * 1 + col * 1+1),(i * 1+1),(i - col + 1),(i - col)];
	}else{
		nearby = [(i - col),(i - col + 1),(i * 1+1),(i * 1 + col * 1+1),(i * 1 + col * 1),(i * 1 + col * 1-1),(i - 1),(i - col - 1)];		
	}
	return nearby;
};

function right(cell){
	if (cell.hasClass('notMine')){
	} else {
		if (cell.hasClass('caution')){
			$('#remaining_mines').val($('#remaining_mines').val() * 1+1);
			cell.removeClass('caution');
			cell.text(cell.val());
			cell.removeClass('glyphicon glyphicon-flag');			
		} else {
			cell.addClass('caution');
			cell.text('');
			cell.addClass('glyphicon glyphicon-flag');
			$('#remaining_mines').val($('#remaining_mines').val() - 1);
			var clickCount = $('.notMine').length;
			var cautionCount = $('.caution').length;
			var rows = $("#rowval").val();
			var cols = $("#colval").val();
			if((clickCount + cautionCount) == (cols * rows) && $('#remaining_mines').val() == 0){
				alert('You win! You swept all the mines!');
				$('<table><tbody>').empty();
				window.location.reload();
				$('#grid_size').prop('disabled', false);
			}
		}
	}
};

function left(cell){
	if(cell.hasClass('caution')){
		} else if (cell.hasClass('mine')) {
			$('.mine').each(function(){
				$(this).text('');
				$(this).addClass('BOOM!');
				$(this).addClass('glyphicon glyphicon-cog');	
		});
		alert('BOOM!  game over!');
		$('<table><tbody>').empty();
		window.location.reload();
		$('#grid_size').prop('disabled', false);
	} else {
		var nearby = proximity(cell);
		if(cell.hasClass('notMine')){
			var danger_close = 0;
			var caution_close = 0;
			nearby.forEach(function(entry){
				if ($('#MINE_FIELD').find('#' + entry).hasClass('boom')){
					danger_close++;
				}
				if ($('#MINE_FIELD').find('#' + entry).hasClass('caution')){
					surrounding_flags++;
				}
			});
			if (caution_close == danger_close){
				nearby.forEach(function(entry){
					var next_cell = ($('#MINE_FIELD').find('#' + entry));
					if(!next_cell.hasClass('caution') && !next_cell.hasClass('notMine')){
						left(next_cell);
					}
				});
			}	
		} else {
			cell.addClass('notMine');
			cell.removeClass('btn btn-lg btn-info');
			cell.addClass('btn btn-lg btn-default');
			if(cell.val() == 0){
				cell.addClass('not_near_bombs');
				nearby.forEach(function(entry){
					var next_cell = ($('#MINE_FIELD').find('#' + entry));
					if(!next_cell.hasClass('notMine')){
						left(next_cell);
					}
				});
			} else {
				cell.text(cell.val());
			}
		}
		var clickCount = $('.notMine').length;
		var cautionCount = $('.caution').length;
		var rows = $("#rowval").val();
		var cols = $("#colval").val();
		if((clickCount + cautionCount) == (cols * rows) && $('#remaining_mines').val() == 0){
			alert('You win! You swept all the mines!');
			$('<table><tbody>').empty();
			window.location.reload();
			$('#grid_size').prop('disabled', false);
		}	
	}
};
