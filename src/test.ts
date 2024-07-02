import{DNSBuffer} from "./lib/buffer";

const buffer = new DNSBuffer.init();
const s = "DebuddingLogFrString";
buffer.writeString(s);

console.debug(buffer.readString(s.length));