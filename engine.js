var ctx = $("#viewport")[0].getContext("2d");

function drawPolar(angle, length) {
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(300*length*Math.cos(angle), -300*length*Math.sin(angle));
	ctx.stroke();
}

function drawToEdge(angle) {
	var sina = Math.sin(angle),
		cosa = Math.cos(angle),
		tana = Math.tan(angle);
	
	ctx.beginPath();
	ctx.moveTo(0,0);
	if (Math.abs(sina) > Math.abs(cosa)) {
		ctx.lineTo(300/tana,-300*Math.sign(sina));
	} else {
		ctx.lineTo(300*Math.sign(cosa),-300*tana);
	}
	ctx.stroke();
}

function update() {
	var i = $("#i").val(),
		j = $("#j").val(),
		k = $("#k").val(),
		x = $("#x").val(),
		y = $("#y").val(),
		z = $("#z").val(),
		c = $("#c").val();
	var lijk = Math.sqrt(i*i + j*j + k*k),
		lxyz = Math.sqrt(x*x + y*y + z*z);
	i /= lijk;
	j /= lijk;
	k /= lijk;
	x /= lxyz;
	y /= lxyz;
	z /= lxyz;
	
	ctx.fillStyle = "#eeeeee";
	ctx.fillRect(0,0,600,600);
	
	ctx.translate(300,300);
	ctx.lineWidth = 1;
	
	ctx.strokeStyle = "#ee1111";
	drawToEdge(Math.PI/2);
	ctx.strokeStyle = "#11ee11";
	drawPolar(1, 0.5);
	ctx.strokeStyle = "#1111ee";
}

$("#gobutton").click( update );

$( document ).ready( update );