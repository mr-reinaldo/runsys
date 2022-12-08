import ssh2 from 'ssh2';
import cryptojs from 'crypto-js';

const SSHClient = ssh2.Client;

export async function loadSocket(io, config, channel) {
    // Disconnect all previous connections
    io.removeAllListeners();

    // Socket.io connection
    io.on('connection', (socket) => {
        // debug connection
        console.info(`\x1b[36mUser connected: %s - Channel: %s\x1b[0m`, socket.id, channel);

        // Array of channels
        const channels = [];

        // Add channel to array
        channels.push(channel);

        // Create a new SSH connection
        const sshConnection = new SSHClient();

        // Destructuring config object
        const { host, port, username, password } = config;

        // Decrypt password
        const decryptedPassword = cryptojs.AES.decrypt(password, process.env.SECRET_KEY_AES).toString(cryptojs.enc.Utf8);

        // Connect to SSH server
        sshConnection.connect({
            host: host,
            port: port,
            username: username,
            password: decryptedPassword,
        });

        // When SSH connection is ready
        sshConnection.on('ready', function () {
            // Emit message to client
            socket.emit(channels[0], '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');

            // Create a new SSH shell
            sshConnection.shell(function (err, stream) {
                // If error
                if (err) {
                    // Emit error message to client
                    return socket.emit(
                        channels[0],
                        '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n'
                    );
                }

                // Browser -> Backend
                socket.on(channels[0], function (data) {
                    stream.write(data);
                });

                // Backend -> Browser
                stream
                    .on('data', function (d) {
                        socket.emit(channels[0], d.toString('binary'));
                    })
                    .on('close', function () {
                        sshConnection.end();
                        socket.leave(channels[0]);
                    });
            });
        });

        // When SSH connection is closed
        sshConnection.on('close', function () {
            // Emit message to client
            socket.emit(channels[0], '\r\n*** SSH CONNECTION CLOSED ***\r\n');
            // Disconnect the socket client
            socket.disconnect();

            // Remove channel from array
            channels.pop();
        });

        // When SSH connection has an error
        sshConnection.on('error', function (err) {
            // Emit error message to client
            socket.emit(channels[0], '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
            // Disconnect the socket client
            socket.disconnect();

            // Remove channel from array
            channels.pop();
        });

        // When socket client disconnects
        socket.on('disconnect', function () {
            // Emit message to client
            socket.emit(channels[0], '\r\n*** SSH CONNECTION CLOSED ***\r\n');
            // Disconnect the SSH connection
            sshConnection.end();

            // Remove channel from array
            channels.pop();

            console.log('\x1b[33mUser disconnected: %s - Channel: %s\x1b[0m', socket.id, channel);
        });
    });
}
