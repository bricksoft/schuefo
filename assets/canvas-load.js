var config = {
    moons: [3,2,3],
    maxTail: 260,
    factor: function(level) {
                  return Math.pow(-1, level-1) * ( Math.pow( level + 1, 2)) / 12;
              },
    radius: function(level) {					       
                  return 50 / ( Math.pow( level, -0.1) +1 );
              },
    orbit: function(level) {							
                  var sum = 0;
                  for ( var i = level; i < config.moons.length; ++i ) {
                      sum += config.orbit(i+1);
                  }
                  return (sum + 1.05 * config.radius(level));
              },
    scale: 1,
};

function animate(canvas, ctx, startTime) {
    var dt = (new Date()).getTime() - startTime;			
    
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineDashOffset = -dt / 100;
    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    var center = { x: canvas.width/2.0, y: canvas.height/2.0 };
    if (  !config.lookup ) {
        config.lookup = [];
        for ( var i = 0; i < config.moons.length; ++i ) {
            config.lookup.push(config.orbit(i));
        }
    }
    startRecursion( ctx, center, dt, config );
    
    // request new frame
    requestAnimFrame(function() {
        animate(canvas, ctx, startTime);
    });
}

function startRecursion( ctx, position, dt, configuration ) {
    recursiveDraw( ctx, position, dt, configuration, 0, 0, 0 );
}

function fillCircle(ctx, position, radius) {
    ctx.beginPath();			
    ctx.arc(position.x, position.y, radius, 0, 2.0*Math.PI);
    ctx.fillStyle= '#E94835';
    ctx.fill();
}

function drawCircle(ctx, position, radius, lineDash) {
    ctx.beginPath();			
    ctx.arc(position.x, position.y, radius, 0, 2.0*Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#fff';
    if ( lineDash ) { 
        ctx.setLineDash( lineDash ); 
    } else {
        ctx.setLineDash( [0] );
    }
    ctx.stroke();
}

function drawLine(ctx, start, end, lineDash) {
    ctx.beginPath();
    ctx.moveTo( start.x, start.y );
    ctx.lineTo( end.x, end.y );
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.lineCap = 'round';
    if ( lineDash ) { 
        ctx.setLineDash( lineDash ); 
    } else {
        ctx.setLineDash( [0] );
    }
    ctx.stroke();
}

function getPosition(center, radius, angle) {
    var result = { 
        x: (center.x + radius * Math.cos(angle)),
        y: (center.y + radius * Math.sin(angle)),
    };
    return result;
}
		

function recursiveDraw( ctx, position, time, config, parentAngle, level, queueId ) {
    var moons = config.moons;
    var circleRadius = config.radius(level) * config.scale;			
    var orbitRadius = config.lookup[level] * config.scale;
    var omega = 2.0 * Math.PI * time / 1000.0;
    
    drawCircle ( ctx, position, circleRadius );
    fillCircle ( ctx, position, circleRadius * 0.85 );
    
    if ( level < moons.length ) {
        
        drawCircle( ctx, position, orbitRadius );
        var count = moons[level];
        var phase = (2.0 * Math.PI) / count;
        
        for ( var i = 0; i < count; ++i ) {					
            var angle = config.factor(level) * omega + phase * i + parentAngle;
            pos = getPosition( position, orbitRadius, angle );
            drawLine ( ctx, position, pos );
            
            queueId = recursiveDraw( ctx, pos, time, config, angle, level + 1, queueId);
        }
        
    } else {
        if ( ctx.queues.length <= queueId ) {
            ctx.queues.push([]);
        }
        var elem = ctx.queues[queueId];
        elem.push ( position );
        if ( elem.length > config.maxTail ) {
            elem.shift();
        }
        
        for ( var i = elem.length-2; i >= 0 ; i-- ) {
            var oldE = elem[i+1];
            var newE = elem[i+0];
            var alpha = i / elem.length;
            ctx.beginPath();
            ctx.moveTo( oldE.x, oldE.y );
            ctx.lineTo ( newE.x, newE.y );
            ctx.lineWidth = Math.log(i);				
            ctx.lineCap = 'round';
            ctx.stroke();
        }
        queueId = queueId + 1;
    }
    return queueId;
}


requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000.0 / 60.0);
        };
})();

var canvas = document.getElementById('loadcanvas');
console.log(canvas);

var ctx = canvas.getContext('2d');
ctx.queues = [];

var startTime = (new Date()).getTime();
animate(canvas, ctx, startTime);
		