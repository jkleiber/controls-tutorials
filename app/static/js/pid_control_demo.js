
/*
 * Make sure to include: <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script> before this script 
 */
window.Promise ||
document.write(
    '<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"><\/script>'
)
window.Promise ||
document.write(
    '<script src="https://cdn.jsdelivr.net/npm/eligrey-classlist-js-polyfill@1.2.20171210/classList.min.js"><\/script>'
)
window.Promise ||
document.write(
    '<script src="https://cdn.jsdelivr.net/npm/findindex_polyfill_mdn"><\/script>'
)

// System parameters
var sys_params = {
    a: -2,
    b: -4,
    c: 0.3
};

// Resources
function loadImage(url) {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}

let auv_img = new Image();
auv_img.onload = function(){}
auv_img.src = "static/img/mid-submarine.png";


const delay = ms => new Promise(res => setTimeout(res, ms));

function second_order_sys(x, u, params) {
    // Get states
    var y = x[0];
    var ydot = x[1];

    // Get parameters
    var a = params.a;
    var b = params.b;
    var c = params.c;

    // Set up second order system:
    // x_dot  = [0  1][x]    + [0]
    // x_ddot = [a  b][xdot]   [c]u
    xdot = ydot;
    xddot = (a * y) + (b * ydot) + (c * u);

    return [xdot, xddot];
}

function pid_chart_generator(x_id, u_id, tf, speed) {
    var x_options = {
        series: [],
        chart: {
            id: 'realtime',
            height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: speed
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'System State',
            align: 'left'
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'numeric',
            min: 0,
            max: tf
        },
        yaxis: {
            max: 50,
            min: -50,
            decimalsInFloat: 2
        },
        legend: {
            show: true
        },
    };
    var u_options = {
        series: [],
        chart: {
            id: 'realtime',
            height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: speed
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Control',
            align: 'left'
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'numeric',
            min: 0,
            max: tf
        },
        yaxis: {
            max: 50,
            min: -50,
            decimalsInFloat: 2
        },
        legend: {
            show: true
        },
    };


    var x_chart_1 = new ApexCharts(document.querySelector(x_id), x_options);
    var u_chart_1 = new ApexCharts(document.querySelector(u_id), u_options);

    return [x_chart_1, u_chart_1];
}

const pid_control_sim = async(x_data, pid_data, sim_data) => {
    // Current time
    var t = sim_data.t;

    // Timestep
    var dt = sim_data.dt;

    // Compute error on position
    var error = sim_data.setpoint - sim_data.x[0];

    // Proportional control
    var P = sim_data.Kp * error;

    // Integral control
    sim_data.integrator += sim_data.Ki * error * dt;
    var I = sim_data.integrator;

    // Derivative control
    var slope = (error - sim_data.prev_error) / dt;
    var D = sim_data.Kd * slope;

    // Control
    var u = P + I + D;

    // Update dynamics
    var xdot = second_order_sys(sim_data.x, u, sys_params);

    // Integrate
    sim_data.x[0] += xdot[0] * dt;
    sim_data.x[1] += xdot[1] * dt;

    // Update time
    sim_data.t += dt;

    // Update derivative tracker
    sim_data.prev_error = error;

    // Update position chart
    x_data[0].data.push({
        x: t,
        y: sim_data.x[0]
    });
    x_data[1].data.push({
        x: t,
        y: sim_data.x[1]
    });
    x_data[2].data.push({
        x: t,
        y: error
    });
    
    // Update control chart
    pid_data[0].data.push({
        x: t,
        y: u
    });
    pid_data[1].data.push({
        x: t,
        y: P
    });
    pid_data[2].data.push({
        x: t,
        y: I
    });
    pid_data[3].data.push({
        x: t,
        y: D
    });
}

function example_reset(x, u) {
    u.series = [
        {
            name: "PID Control",
            data: []
        },
        {
            name: "P",
            data: []
        },
        {
            name: "I",
            data: []
        },
        {
            name: "D",
            data: []
        }
    ];

    x.series = [{
        name: "Position",
        data: []
    },
    {
        name: "Velocity",
        data: []
    },
    {
        name: "Error",
        data: []
    }];
}

function drawAUV(canvas, ctx, pitch) {
    // Prepare the context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.imageSmoothingEnabled = false;

    drawBackground(ctx, canvas.width, canvas.height);
    drawRotatedImage(ctx, auv_img, 50, 50, pitch);
}

function drawBackground(ctx, width, height) {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "#5291f7";
    ctx.fill();
}

function drawRotatedRect(ctx, x, y, width, height, degrees) {

    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x + width / 2, y + height / 2);
    // rotate the rect
    ctx.rotate(degrees * Math.PI / 180);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect(-width / 2, -height / 2, width, height);

    ctx.fillStyle = "gold";
    ctx.fill();

    // restore the context to its untranslated/unrotated state
    ctx.restore();

}

function drawRotatedImage(ctx, image, x, y, degrees) {

    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x + image.width / 2, y + image.height / 2);
    // rotate the rect
    ctx.rotate(degrees * Math.PI / 180);

    // draw the image on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the image needs to be offset accordingly when drawn
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    // restore the context to its untranslated/unrotated state
    ctx.restore();

}