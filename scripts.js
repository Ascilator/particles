function getStarted() {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var array, frequancy, context, analyzer;
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    array = new Uint8Array(200);
    prticles = [];
    options = {
        back: "rgba(17, 17, 19, 1)",
        particle_clr: "rgba(255, 40, 40, 1)",
        particle_radius: 20,
        particle_count: 30,
        particle_max_count: 110,
        particle_velociti: 4,
        line_lebg: 150,
        line_widht: '3'
    }
    document.querySelector('body').appendChild(canvas);

    function init() {
        for (var i = 0; i < options.particle_count; i++) {
            prticles.push(new Particle_item());
        }

        loop();
    }

    function reDrawBack() {
        ctx.fillStyle = options.back;
        ctx.fillRect(0, 0, w, h);
    }
    function loop() {
        reDrawBack();
        reDrawParticles();
        DrawLines();
        requestAnimationFrame(loop);
    }
    function loop_2() {
        analyzer.getByteFrequencyData(array);
        requestAnimationFrame(loop_2);
        var sum = 0;
        for (var i = 160; i < 200; i++) {
            sum += array[i];
        }
        sum /= 40;
        options.particle_radius = sum / 25 * 20 + 20;

    }
    function reDrawParticles() {
        for (var i in prticles) {
            prticles[i].new_position();
            prticles[i].reDraw();

            /*   for (var j in prticles) {
                   x1 = prticles[i].x;
                   x2 = prticles[j].x;
                   y1 = prticles[i].y;
                   y2 = prticles[j].y;
   
                   length = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                   if (length <= 60) {
                       prticles[i].velocity_x *= -1;
                       prticles[i].velocity_y *= -1;
   
                       prticles[j].velocity_x *= -1;
                       prticles[j].velocity_y *= -1;
                   }
               }
               */
        }
    };
    function DrawLines() {
        var x1, y1, x2, y2, length, opacity;
        for (var i in prticles) {
            for (var j in prticles) {
                x1 = prticles[i].x;
                x2 = prticles[j].x;
                y1 = prticles[i].y;
                y2 = prticles[j].y;

                length = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                color_x = (x1 + x2) * 0.5 / w;
                color_y = (y1 + y2) * 0.5 / h;
                if (length <= options.line_lebg) {
                    opacity = 1 - length / options.line_lebg;
                    ctx.lineWidth = options.line_widht;
                    ctx.strokeStyle = `rgba(${(1 - color_x) * 255}, ${color_y * 255} , ${Math.sqrt(Math.pow(color_x, 2) + Math.pow(color_y, 2)) / 2 * 255},${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }


            }
        }
    }
    class Particle_item {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.velocity_x = Math.random() * (options.particle_velociti * 2) - options.particle_velociti;
            this.velocity_y = Math.random() * (options.particle_velociti * 2) - options.particle_velociti;

        }
        constructor_2(a, b) {
            this.x = a;
            this.y = b;


        }
        new_position() {
            this.x += this.velocity_x;
            this.y += this.velocity_y;
            if (this.x >= w || this.x <= 0) {
                this.velocity_x *= -1;
            }
            if (this.y >= h || this.y <= 0) {
                this.velocity_y *= -1;
            }
        }
        resize_position(new_x, new_y) {
            this.x = new_x;
            this.y = new_y;
        }
        reDraw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, options.particle_radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = `rgba(${(1 - this.x / w) * 255}, ${this.y / h * 255} , ${Math.sqrt(Math.pow(this.x / w, 2) + Math.pow(this.y / h, 2)) / 2 * 255}, 1)`;
            ctx.fill();
        }
    }

    canvas.addEventListener('click', function (e) {
        console.log(options.particle_count);
        if (options.particle_count < options.particle_max_count) {
            var push_part = new Particle_item();

            push_part.constructor_2(e.clientX, e.clientY);
            prticles.push(push_part);
            options.particle_count++;
        }
    });

    window.addEventListener("resize", function () {
        prev_w = w;
        prev_h = h;



        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        for (var i in prticles) {
            prticles[i].resize_position(w / prev_w * prticles[i].x, h / prev_h * prticles[i].y);

            prticles[i].new_position();
            prticles[i].reDraw();
        }
    });
    var h1 = document.getElementById('h1');
    window.addEventListener('click', function () {
        console.log('+');
        h1.remove();

        context = new AudioContext();
        analyzer = context.createAnalyser();

        navigator.mediaDevices.getUserMedia({
            audio: true,
        }).then(stream => {
            src = context.createMediaStreamSource(stream);
            src.connect(analyzer);
            loop_2();
        }).catch(error => {
            //location.reload();
            console.log('----')
        }
        )
    });
    init();
}

getStarted();
