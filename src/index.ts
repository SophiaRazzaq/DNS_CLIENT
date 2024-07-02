import { DNSBuffer } from './lib/buffer';
import { DNSHeader  } from './lib/header';
import { DNSQuestion } from './lib/question';
import { DNSQuery } from './lib/packet';
import { DNSNetwork } from './lib/network';
import { FileReader } from './fileReader';
import { CLI } from './CLIReader';
import { DNSAnswer } from './lib/record';
import * as fs from 'fs';

async function main() {
  let buffer: DNSBuffer;
  let domainName = '';
  let queryType = '';

  console.log("====================Welcome to the DNS CLIENT!==========================");

  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                    USER INPUT LAYER

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const source = await CLI.askQuestion('Read from file or CLI? (file/cli): ');

  try {
    if (source.toLowerCase() === 'file') {
      // Read from file
      const filePath = await CLI.askQuestion('Enter the file path: ');
      const fileBuffer = FileReader.readFile(filePath);
      console.log("\nRead successfully from file:", fileBuffer);

      buffer = new DNSBuffer(fileBuffer);
      console.log("Query written to buffer:", buffer.getBuffer().toString('hex'));
    } 
    
    else {
      // Read from CLI input
      domainName = await CLI.askQuestion('Enter the domain name: ');
      queryType = await CLI.askQuestion('Enter the query type (A/AAAA/CNAME): ');

      buffer = new DNSBuffer();
      const header = DNSHeader .create(0, 0); 

      const question = new DNSQuestion(domainName, 
        queryType === 'A' ? 1 : queryType === 'AAAA' ? 28 : 5 );

      const query = new DNSQuery();
      query.header = header;
      query.questions.push(question);

      query.write(buffer);
      console.log("\nQuery written to buffer:", buffer.getBuffer().toString('hex'));
    }

    
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                    SINITIALIZING DNS NETWORK

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const dnsNetwork = new DNSNetwork();
    console.log("\nDNS network initialized");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                    SENND DNS QUERY

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const queryBuffer = buffer.getBuffer();
    const responseBuffer = await dnsNetwork.send(queryBuffer);
    console.log("Response buffer received:", responseBuffer.toString('hex'));

    buffer.setBuffer(responseBuffer);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                    DEALING WITH RESPONSE

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const responseQuery = new DNSQuery();
    responseQuery.read(buffer);
    console.log("response query:",responseQuery);  
     



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                    SAVING THE DATA IN OUTPUT FILE

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const output = `Received response:
Header:
  QR: ${responseQuery.header.qr}
  OPCode: ${responseQuery.header.opCode}
  AA: ${responseQuery.header.aa}
  TC: ${responseQuery.header.tc}
  RD: ${responseQuery.header.rd}
  RA: ${responseQuery.header.ra}
  Z: ${responseQuery.header.z}
  RCODE: ${responseQuery.header.rCode}


Question:
  Domain Name: ${responseQuery.questions[0]?.name}
  Query Type: ${responseQuery.questions[0]?.type}
  Questions Asked: ${responseQuery.header.qdCount}
  Answer Count: ${responseQuery.header.anCount}
  Authority Count: ${responseQuery.header.nsCount}
  Additional Count: ${responseQuery.header.arCount}

Answers:
${responseQuery.header.anCount ? responseQuery.answers.map(answer => `
  Name: ${answer.name}
  Type: ${answer.type}
  Class: ${answer.class}
  TTL: ${answer.ttl}
  Length: ${answer.len}
  RData: ${answer.rdata}`).join('\n') : ''}

`;

    fs.writeFileSync('dns_response.txt', output);
    console.log('\nResponse saved to dns_response.txt');
  } catch (error) {
    console.error('\nFailed to send DNS query:', error);
  }
}

main();
