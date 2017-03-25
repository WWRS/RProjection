var ctx = $("#viewport")[0].getContext("2d");

function getVal(id) {
	var num = $(id).val().replace(/[^\d-\.]/g, "");
	if (num == "") {
		return 1;
	} else if (num == '-'){
		return 1;
	} else {
		return num;
	}
}

function drawPolar(angle, length) {
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(300*length*Math.cos(angle), -300*length*Math.sin(angle));
	ctx.stroke();
}

function drawFunc(x, y) {
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(300*x, -300*y);
	ctx.stroke();
}

function update() {
	var i = getVal("#i"),
		j = getVal("#j"),
		k = getVal("#k"),
		x = getVal("#x"),
		y = getVal("#y"),
		z = getVal("#z"),
		c = getVal("#c");
	var lijk = Math.sqrt(i*i + j*j + k*k),
		lxyz = Math.sqrt(x*x + y*y + z*z)*Math.sign(c);
	i /= lijk;
	j /= lijk;
	k /= lijk;
	x /= lxyz;
	y /= lxyz;
	z /= lxyz;
	
	ctx.fillStyle = "#eeeeee";
	ctx.fillRect(-300,-300, 600,600);
	
	if ( x==0 && y==0 ){
		ctx.strokeStyle = "#ee1111";
		drawFunc(1,0);
		ctx.strokeStyle = "#11ee11";
		drawFunc(0,1);
	} else {
		ctx.strokeStyle = "#ee1111";
		var x2=x*x,
			y2=y*y,
			z2=z*z;
		drawPolar( -Math.acos( -y/( Math.sqrt(1-x*x)*Math.sqrt(1-z*z) ) ) , 1-Math.abs(x));
		ctx.strokeStyle = "#11ee11";
		drawPolar( -Math.acos( x/( Math.sqrt(1-y*y)*Math.sqrt(1-z*z) ) ) , 1-Math.abs(y));
		ctx.strokeStyle = "#1111ee";
		drawPolar(Math.PI/2, 1-Math.abs(z));
	}
	
}

$("#gobutton").click( update );

$( document ).ready( function() {
	ctx.translate(300,300);
	ctx.lineWidth = 1;
	
	update();
});