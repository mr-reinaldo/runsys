import systeminformation from 'systeminformation';

export const serverController = async (req, res) => {
    // Get cpu usage.
    async function cpuUsage() {
        const data = await systeminformation.currentLoad();
        // return in integer
        return Math.round(data.currentLoad);
    }

    // Get memory usage.
    async function memoryUsage() {
        const mem = await systeminformation.mem();
        return Math.round(mem.active / mem.total * 100);
    }

    //get  uptime server
    async function uptime() {
        const data = await systeminformation.time();
        // days
        const days = data.uptime / 86400;
        // hours
        const hours = (data.uptime % 86400) / 3600;
        // minutes
        const minutes = ((data.uptime % 86400) % 3600) / 60;
        // seconds
        const seconds = ((data.uptime % 86400) % 3600) % 60;

        return `${Math.floor(days)}d ${Math.floor(hours)}h ${Math.floor(minutes)}m ${Math.floor(seconds)}s`;
    }

    // get distro
    async function distro() {
        const data = await systeminformation.osInfo();
        return data.distro;
    }

    // get kernel
    async function kernel() {
        const data = await systeminformation.osInfo();
        return data.kernel;
    }

    // get hostname
    async function hostname() {
        const data = await systeminformation.osInfo();
        return data.hostname;
    }

    // get cpu model
    async function cpuModel() {
        const data = await systeminformation.cpu();
        return data.manufacturer + ' ' + data.brand;
    }
    // Disk usage
    async function diskUsage() {
        // get % of disk usage
        const data = await systeminformation.fsSize();
        return Math.round(data[0].use);
    }


    // traffic of network
    async function networkTraffic() {
        const data = await systeminformation.networkStats();

        // get rx traffic in  kb/s
        const rx = data[0].rx_sec / 1024;
        // get tx traffic in kb/s
        const tx = data[0].tx_sec / 1024;

        // get current time in 00:00:00 format.
        const time = new Date().toLocaleTimeString();

        // return the trafficNetwork and timeStamps arrays.
        return [rx, tx, time];
    };

    // get all data
    const data = {
        cpuUsage: await cpuUsage(),
        memoryUsage: await memoryUsage(),
        uptime: await uptime(),
        distro: await distro(),
        kernel: await kernel(),
        hostname: await hostname(),
        cpuModel: await cpuModel(),
        diskUsage: await diskUsage(),
        networkTraffic: await networkTraffic(),
    };

    res.json(data);
};
