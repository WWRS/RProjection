// Get the drawing panel
var ctx = $("#viewport")[0].getContext("2d");

// Gets input and does some parsing
function getVal(id) {
	var num = $(id).val().replace(/[^\d-\.]/g, ""); // Crude way to fix non-numeric inputs
	if (num == "") { // ex, the user entered __x which should be interpreted as x = 1x
		return 1;
	} else if (num == '-') { //ex, the user entered -x which should be interpreted as -x = -1x
		return -1;
	} else {
		return num;
	}
}

// Draws a line from (0,0) to (x,y)
function drawFunc(x, y) {
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(300*x, -300*y);
	ctx.stroke();
}

// Called on load and on button press. Updates canvas.
function update() {
	// Get all the values
	var i = getVal("#i"),
		j = getVal("#j"),
		k = getVal("#k"),
		x = getVal("#x"),
		y = getVal("#y"),
		z = getVal("#z"),
		c = getVal("#c");
	// Get their lengths
	var lijk = Math.sqrt(i*i + j*j + k*k),
		lxyz = Math.sqrt(x*x + y*y + z*z)*Math.sign(c); // sign(c) is for flipping
	// Convert to unit vectors
	i /= lijk;
	j /= lijk;
	k /= lijk;
	x /= lxyz;
	y /= lxyz;
	z /= lxyz;
	
	// Clean the canvas by drawing over it
	ctx.fillStyle = "#eeeeee";
	ctx.fillRect(-300,-300, 600,600);
	
	// Draw axes
	if ( x==0 && y==0 ) { // If vertical, draw xy-plane
		ctx.strokeStyle = "#ee1111";
		drawFunc(1,0);
		ctx.strokeStyle = "#11ee11";
		drawFunc(0,1);
		ctx.strokeStyle = "#111111";
		drawFunc(i,j);
	} else {
		// s is used repeatedly, so calculate it once and store it to save some time
		var s = Math.sqrt(1-z*z);
		
		// Draw axes
		ctx.strokeStyle = "#ee1111";
		drawFunc( -y/s, -x*z/s ); // Magic
		ctx.strokeStyle = "#11ee11";
		drawFunc( x/s, -y*z/s ); // Magic
		ctx.strokeStyle = "#1111ee";
		drawFunc( 0, s ); // Magic
		
		// Draw vector
		ctx.strokeStyle = "#111111";
		drawFunc( (x*j-y*i)/s, (-i*x*z-j*y*z)/s + k*s ); // Magic
		
		/* Notes on "Magic":
			Find comp_a u and comp_b u
				where u is the vector given by projecting vector w onto (viewplane) subspace V
				  and the basis of V: { a , b }
					a = <-xz, -yz, x^2+y^2>
					b = <-y, x, 0>
			comp_a u is the y-coord of V and comp_b u is the x-coord of V
		*/
	}
}

// Handle button click
$("#gobutton").click( update );

window.addEventListener("keydown", function (event) {
	// Do nothing if the event was already processed
	if (event.defaultPrevented) {
		return;
	}

	switch (event.key) {
		case "Enter":
			update();
			break;
		case "w":
		case "ArrowUp":
			$("#z").val(getVal("#z")*1.02);
			update();
			break;
		case "s":
		case "ArrowDown":
			$("#z").val(getVal("#z")*0.98);
			update();
			break;
		case "a":
		case "ArrowLeft":
			$("#x").val(getVal("#x")*1.01);
			$("#y").val(getVal("#y")*0.99);
			update();
			break;
		case "d":
		case "ArrowRight":
			$("#y").val(getVal("#y")*1.01);
			$("#x").val(getVal("#x")*0.99);
			update();
			break;
		default:
			return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true); //Thanks, exd5cxd4

// Initialization of ctx and first draw
$( document ).ready( function() {
	ctx.translate(300,300);
	ctx.lineWidth = 1;
	
	update();
});