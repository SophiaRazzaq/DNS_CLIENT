import { DNSHeader  } from './header';
import { DNSBuffer } from './buffer';
import { DNSQuestion } from './question';
import { DNSAnswer } from './record';

export class DNSQuery {
  header: DNSHeader ;
  questions: DNSQuestion[];
  answers: DNSAnswer[];
  authorities: DNSAnswer[];
  additionals: DNSAnswer[];

  constructor() {
    this.header = DNSHeader .create(0, 0);
    this.questions = [];
    this.answers = [];
    this.authorities = [];
    this.additionals = [];
  }

  write(buffer: DNSBuffer) {
    this.header.write(buffer);
    for (const question of this.questions) {
      question.write(buffer);
    }
    for (const answer of this.answers) {
      answer.write(buffer);
    }
    for (const authority of this.authorities) {
      authority.write(buffer);
    }
    for (const additional of this.additionals) {
      additional.write(buffer);
    }
  }

  read(buffer: DNSBuffer) {
    this.header.read(buffer);
    const qdCount = this.header.qdCount;
    const anCount = this.header.anCount;
    const nsCount = this.header.nsCount;
    const arCount = this.header.arCount;

    for (let i = 0; i < qdCount; i++) {
      const question = new DNSQuestion();
      question.read(buffer);
      this.questions.push(question);
    }
    for (let i = 0; i < anCount; i++) {
      const answer = new DNSAnswer();
      answer.read(buffer);
      this.answers.push(answer);
    }
    for (let i = 0; i < nsCount; i++) {
      const authority = new DNSAnswer();
      authority.read(buffer);
      this.authorities.push(authority);
    }
    for (let i = 0; i < arCount; i++) {
      const additional = new DNSAnswer();
      additional.read(buffer);
      this.additionals.push(additional);
    }
  }
}
