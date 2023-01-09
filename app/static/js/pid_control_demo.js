
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

const pid_control_sim = async(charts, x0, setpoint, Kp, Ki, Kd, tf, dt) => {
    var N = Math.floor(tf / dt);
    var integrator = 0;
    var x_t = x0;
    var t = 0;
    var last_error = 0;

    pid_data = [
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
    x_data = [{
        name: "State",
        data: []
    }];

    for (var i = 0; i < N; i++) {
        var error = setpoint - x_t;

        // Proportional control
        var P = Kp * error;

        // Integral control
        integrator += Ki * error * dt;
        var I = integrator;

        // Derivative control
        var slope = (error - last_error) / dt;
        var D = Kd * slope;

        // Control
        var u = P + I + D;

        // Update dynamics
        var xdot = cart_pole(x_t, u);

        // Integrate
        x_t += xdot * dt;

        // Update time
        t += dt;

        // Chart Data
        x_data[0].data.push({
            x: t,
            y: x_t
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

        // Update charts
        charts.pid_chart.updateSeries(pid_data);
        charts.x_chart.updateSeries(x_data);

        // Add time delay
        var dt_in_ms = Math.floor(dt * 1000);
        await delay(dt_in_ms);
    }


}

