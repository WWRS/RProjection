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

// Does the math to convert an angle (in radians) and a length (as a fraction) to functional notation
function drawPolar(angle, length) {
	drawFunc(length*Math.cos(angle), length*Math.sin(angle));
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
	} else {
		// Angles for axes
		var angleI = Math.acos( -y/( Math.sqrt( (1-z*z)*(1-x*x) ) ) ), // Magic
			angleJ = Math.acos( x/( Math.sqrt( (1-z*z)*(1-y*y) ) ) ); // Magic
		// If z is positive, i and j are down. If z is negative, i and j are up.
		if ( z*x > 0 ) {
			angleI *= -1;
		}
		if ( z*y > 0 ) {
			angleJ *= -1;
		}
		// Draw axes
		ctx.strokeStyle = "#ee1111";
		drawPolar( angleI, Math.sqrt(1-Math.abs(x)) ); // Magic
		ctx.strokeStyle = "#11ee11";
		drawPolar( angleJ, Math.sqrt(1-Math.abs(y)) ); // Magic
		ctx.strokeStyle = "#1111ee";
		drawPolar( Math.PI/2, Math.sqrt(1-Math.abs(z)) ); // Vertical, Magic
		
		// Angle for vector
		var angleV = Math.acos( (j*x-i*y)/( Math.sqrt( (1-z*z)*( 1-(i*x+j*y+k*z)*(i*x+j*y+k*z) ) ) ) ); // Magic
		// If the z-projection of the vector is less than 0, v points down.
		if ( k - z*(i*x+j*y+k*z) < 0 ) {
			angleV *= -1;
		}
		// Draw vector
		ctx.strokeStyle = "#111111";
		drawPolar( angleV, Math.sqrt(1-Math.abs(i*x+j*y+k*z)) );
		
		/* Notes on "Magic":
			Angles:
				The positive x vector is given by (n x k)
					where n is the unit vector of the normal of the plane
					In this case, that's <0, z, -y>
				The projection of the vector along the plane is given by ( V - (V . n) * n / ( ||V|| * ||n|| ) )
				cos(theta) between V and positive x is given by ( (n x k) . V )/( ||n x k|| * ||V|| )
				||V|| is given by sqrt( (v_1)^2 + (v_2) ^2 + ... + (v_n)^2 )
					where V = <v_1, v_2, ... , v_n>
			
			Lengths:
				The length is given by ( V - comp_n(V) )
					where V is the vector you're looking for
					  and n is the normal vector to the plane
				comp_V(U) is given by (U . V)/( ||U|| * ||V|| )
				In these cases, all the vectors are unit vectors, so the math becomes trivial.
				
			I manually computed and simplified a lot of math.
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