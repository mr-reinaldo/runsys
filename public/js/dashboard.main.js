import Auth from './auth.js';

async function getServerInformation() {

    // Create charts
    const chartCpu = creatChartSimple('chart-cpu', 'line', 'CPU', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
    const chartRam = creatChartSimple('chart-ram', 'bar', 'RAM', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
    const chartDisk = creatChartSimple('chart-disk', 'bar', 'Disk', 'rgba(255, 206, 86, 0.2)', 'rgba(255, 206, 86, 1)');
    const chartNetwork = createChartDobleLine('chart-net', 'line', 'Download', 'Upload');

    setInterval(async () => {
        const response = await fetch('/server', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
        });

        const data = await response.json();

        // update charts
        await updateMyChart(chartCpu, data.cpuUsage);
        await updateMyChart(chartRam, data.memoryUsage);
        await updateMyChart(chartDisk, data.diskUsage);
        await updateMyChartDobleLine(chartNetwork, data.networkTraffic[2], data.networkTraffic[0], data.networkTraffic[1]);

        // update information
        createTbodyInformation('tbodyInformation', data);

    }, 1000);

}

function createTbodyInformation(idTbody, data) {
    let tbody = document.getElementById(`${idTbody}`);
    tbody.innerHTML = `
        <tr>
            <td><i class="bi bi-alarm"></i>&nbsp&nbspUptime</td>
            <td>${data.uptime}</td>
        </tr>
        <tr>
            <td><i class="bi bi-ubuntu"></i>&nbsp&nbspDistro</td>
            <td>${data.distro}</td>
        </tr>
        <tr>
            <td><i class="bi bi-pc-display"></i>&nbsp&nbspHostname</td>
            <td>${data.hostname}</td>
        </tr>
        <tr>
            <td><i class="bi bi-git">&nbsp&nbspKernel</i></td>
            <td>${data.kernel}</td>
        </tr>
        <tr>
            <td><i class="bi bi-cpu"></i>&nbsp&nbspCPU</td>
            <td>${data.cpuModel}</td>
        </tr>
    `;
}

function creatChartSimple(idChart, typeChart, label, backgroundColor, borderColor) {

    const ctx = document.getElementById(`${idChart}`).getContext('2d');

    const myChart = new Chart(ctx, {
        type: `${typeChart}`,
        data: {
            labels: [],
            datasets: [{
                label: `${label}`,
                data: [],
                borderWidth: 2,
                backgroundColor: `${backgroundColor}`,
                borderColor: `${borderColor}`,
            }]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 100,
                }
            },
        }
    });

    // redraw the chart when the window is resized.
    window.addEventListener("resize", async () => {
        await myChart.resize();
    });



    return myChart;
};

function createChartDobleLine(idChart, typeChart, label1, label2) {

    const ctx = document.getElementById(`${idChart}`).getContext('2d');
    const myChart = new Chart(ctx, {
        type: `${typeChart}`,
        data: {
            labels: [],
            datasets: [{
                label: `${label1}`,
                data: [],
                borderWidth: 2,
            },
            {
                label: `${label2}`,
                data: [],
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    display: true,
                    position: 'left',
                },
                x: {
                    min: 0,
                    display: true,
                    position: 'right',
                }
            },
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
                axis: 'x'
            },
            stacked: false,

        }
    });

    // redraw the chart when the window is resized.
    window.addEventListener("resize", async () => {
        await myChart.resize();
    });

    return myChart;
}

async function updateMyChartDobleLine(chart, dataLabel, data1, data2) {

    // remove the first data point from the chart.
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
    }
    // add the new data to the chart.
    chart.data.labels.push(dataLabel);
    chart.data.datasets[0].data.push(data1);
    chart.data.datasets[1].data.push(data2);

    // update the chart.
    chart.update();

}

async function updateMyChart(chart, data) {
    // limit the number of data points to 10.
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    // add the new data point.
    chart.data.labels.push(data);
    chart.data.datasets[0].data.push(data);

    // update the chart.
    chart.update();

}

async function main() {
    await getServerInformation();
}

if (Auth.isAuthenticated()) {
    Auth.userLogged();
    Auth.autoSignout();
    Auth.signoutBtn();
    main();
}




