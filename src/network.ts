import dgram from 'dgram';

export class DNSNetwork {
  private server: string;
  private port: number;
  private timeout: number; // milliseconds
  private protocol: 'udp4' | 'udp6';

  constructor(server: string = '8.8.8.8', port: number = 53, timeout: number = 5000, protocol: 'udp4' | 'udp6' = 'udp4') {
    this.server = server;
    this.port = port;
    this.timeout = timeout;
    this.protocol = protocol;
  }

  async send(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const client = dgram.createSocket(this.protocol);

      client.on('error', (err) => {
        console.error('Socket error:', err);
        client.close();
        reject(err);
      });

      
      // Set a timeout for the response
      const timer = setTimeout(() => {
        console.error('DNS query timed out');
        client.close();
        reject(new Error('DNS query timed out'));
      }, this.timeout);


      client.send(buffer, 0, buffer.length, this.port, this.server, (err) => {
        if (err) {
          clearTimeout(timer);
          console.error('Error sending DNS query:', err);
          client.close();
          reject(err);
        }
      });

      client.on('message', (msg) => {
        clearTimeout(timer);
        client.close();
        resolve(msg);
      });
    });
  }
}
