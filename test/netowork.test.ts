import test from 'ava';
import { DNSNetwork } from '../src/network';
import dgram from 'dgram';

function createMockSocket() {
  const socket: any = {
    send: (buf, offset, length, port, address, callback) => {
      setTimeout(() => {
        callback(null);
      }, 100);
    },
    on: (event, callback) => {
      if (event === 'message') {
        setTimeout(() => {
          callback(Buffer.from([]));
        }, 200);
      }
    },
    close: () => {},
    addMembership: () => {},
    address: () => ({}),
    bind: () => {},
    connect: () => {},
    disconnect: () => {},
    dropMembership: () => {},
    ref: () => {},
    setBroadcast: () => {},
    setMulticastInterface: () => {},
    setMulticastLoopback: () => {},
    setMulticastTTL: () => {},
    setRecvBufferSize: () => {},
    setSendBufferSize: () => {},
    setTTL: () => {},
    unref: () => {},
  };
  return socket;
}

test('DNSNetwork: send method works correctly with udp4', async t => {
  const dnsNetwork = new DNSNetwork('8.8.8.8', 53, 5000, 'udp4');
  const buffer = Buffer.from([]);

  const createSocket = dgram.createSocket;
  dgram.createSocket = () => createMockSocket();

  const result = await dnsNetwork.send(buffer);
  t.true(result instanceof Buffer);

  // Restore the original method
  dgram.createSocket = createSocket;
});

test('DNSNetwork: send method works correctly with udp6', async t => {
  const dnsNetwork = new DNSNetwork('2001:4860:4860::8888', 53, 5000, 'udp6');
  const buffer = Buffer.from([]);

  // Mock dgram.createSocket
  const createSocket = dgram.createSocket;
  dgram.createSocket = () => createMockSocket();

  const result = await dnsNetwork.send(buffer);
  t.true(result instanceof Buffer);

  dgram.createSocket = createSocket;
});

test('DNSNetwork: send method times out correctly with udp4', async t => {
  const dnsNetwork = new DNSNetwork('8.8.8.8', 53, 100, 'udp4');
  const buffer = Buffer.from([]);

  const createSocket = dgram.createSocket;
  dgram.createSocket = () => {
    const socket = createMockSocket();
    socket.send = (buf, offset, length, port, address, callback) => {
      setTimeout(() => {
        callback(null);
      }, 200); 
    };
    return socket;
  };

  const error = await t.throwsAsync(() => dnsNetwork.send(buffer));
  t.is(error.message, 'DNS query timed out');

  dgram.createSocket = createSocket;
});

test('DNSNetwork: send method times out correctly with udp6', async t => {
  const dnsNetwork = new DNSNetwork('2001:4860:4860::8888', 53, 100, 'udp6');
  const buffer = Buffer.from([]);

  const createSocket = dgram.createSocket;
  dgram.createSocket = () => {
    const socket = createMockSocket();
    socket.send = (buf, offset, length, port, address, callback) => {
      setTimeout(() => {
        callback(null);
      }, 200); 
    };
    return socket;
  };

  const error = await t.throwsAsync(() => dnsNetwork.send(buffer));
  t.is(error.message, 'DNS query timed out');

  dgram.createSocket = createSocket;
});
