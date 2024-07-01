import { DNSBuffer } from './buffer';
import { DNSHeader } from './header';
import { DNSQuestion } from './question';
import { DNSQuery } from './query';
import { DNSNetwork } from './network';
import { FileReader } from './fileReader';
import { CLI } from './cli';
import { DNSAnswer } from './record';
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
      const header = new DNSHeader();
      header.qdCount = 1;

      const question = new DNSQuestion(domainName, 
        queryType === 'A' ? 1 : queryType === 'AAAA' ? 28 : 5);

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
    //console.log("BUFFER",buffer);
    console.log('\nReceived response:');
    console.log('Header:');
    console.log(`  Request ID: ${responseQuery.header.id}`);
    console.log(`  Flags: ${responseQuery.header.flags}`);
    console.log(`  QR: ${responseQuery.header.flags >> 15}`);
    console.log(`  OPCode: ${(responseQuery.header.flags >> 11) & 0xf}`);
    console.log(`  AA: ${(responseQuery.header.flags >> 10) & 0x1}`);
    console.log(`  TC: ${(responseQuery.header.flags >> 9) & 0x1}`);
    console.log(`  RD: ${(responseQuery.header.flags >> 8) & 0x1}`);
    console.log(`  RA: ${(responseQuery.header.flags >> 7) & 0x1}`);
    console.log(`  Z: ${(responseQuery.header.flags >> 4) & 0x7}`);
    console.log(`  RCODE: ${responseQuery.header.flags & 0xf}`);
    
    console.log('Question:');
    console.log(`  Domain Name: ${responseQuery.questions[0].name}`);
    console.log(`  Query Type: ${responseQuery.questions[0].type}`);
    console.log(`  Questions Asked: ${responseQuery.header.qdCount}`);
    console.log(`  Answer Count: ${responseQuery.header.anCount}`);
    console.log(`  Authority Count: ${responseQuery.header.nsCount}`);
    console.log(`  Additional Count: ${responseQuery.header.arCount}`);
     

if (responseQuery.answers.length > 0) {
  const answer = responseQuery.answers[0];
 
  console.log(`Name: ${answer.name}`);
  console.log(`Type: ${answer.type}`); 
  console.log(`Class: ${answer.class}`);  
  console.log(`TTL: ${answer.ttl}`);
  console.log(`RData Length: ${answer.len}`);
  console.log(`RData: ${answer.rdata}`);
} else {
  console.log('No answers found in the response.');
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                    SAVING THE DATA IN OUTPUT FILE

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const output = `Received response:
Header:
  Request ID: ${responseQuery.header.id}
  Flags: ${responseQuery.header.flags}
  QR: ${responseQuery.header.flags >> 15}
  OPCode: ${(responseQuery.header.flags >> 11) & 0xf}
  AA: ${(responseQuery.header.flags >> 10) & 0x1}
  TC: ${(responseQuery.header.flags >> 9) & 0x1}
  RD: ${(responseQuery.header.flags >> 8) & 0x1}
  RA: ${(responseQuery.header.flags >> 7) & 0x1}
  Z: ${(responseQuery.header.flags >> 4) & 0x7}
  RCODE: ${responseQuery.header.flags & 0xf}

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
