
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

const delay = ms => new Promise(res => setTimeout(res, ms));

function cart_pole(x, u) {
    return 0;
}

function pid_chart_generator(x_id, u_id, speed) {
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
            max: 10
        },
        yaxis: {
            max: 10,
            min: -10
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
            text: 'Proportional Control',
            align: 'left'
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'numeric',
            min: 0,
            max: 10
        },
        yaxis: {
            max: 10,
            min: -10
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
    // Compute error
    var error = sim_data.setpoint - sim_data.x;

    // Proportional control
    var P = sim_data.Kp * error;

    // Integral control
    sim_data.integrator += sim_data.Ki * error * sim_data.dt;
    var I = sim_data.integrator;

    // Derivative control
    var slope = (error - sim_data.prev_error) / sim_data.dt;
    var D = sim_data.Kd * slope;

    // Control
    var u = P + I + D;

    // Update dynamics
    var xdot = cart_pole(sim_data.x, u);

    // Integrate
    sim_data.x += xdot * sim_data.dt;

    // Update time
    sim_data.t += sim_data.dt;

    // Update derivative tracker
    sim_data.prev_error = error;

    // Chart Data
    var t = sim_data.t;
    x_data[0].data.push({
        x: t,
        y: sim_data.x
    });

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
        name: "State",
        data: []
    }];
}

