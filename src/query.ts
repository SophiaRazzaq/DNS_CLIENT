import { DNSHeader } from './header';
import { DNSBuffer } from './buffer';
import { DNSQuestion } from './question';
import { DNSAnswer } from './record';

export class DNSQuery {
  header: DNSHeader;
  questions: DNSQuestion[];
  answers: DNSAnswer[];
  authorities: DNSAnswer[];
  additionals: DNSAnswer[];

  constructor() {
    this.header = new DNSHeader();
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
  }

  read(buffer: DNSBuffer) {
    this.header.read(buffer);
    for (let i = 0; i < this.header.qdCount; i++) {
      const question = new DNSQuestion();
      question.read(buffer);
      this.questions.push(question);
    }
    for (let i = 0; i < this.header.anCount; i++) {
      const answer = new DNSAnswer();
      answer.read(buffer);
      this.answers.push(answer);
    }
    for (let i = 0; i < this.header.nsCount; i++) {
      const authority = new DNSAnswer();
      authority.read(buffer);
      this.authorities.push(authority);
    }
    for (let i = 0; i < this.header.arCount; i++) {
      const additional = new DNSAnswer();
      additional.read(buffer);
      this.additionals.push(additional);
    }
  }
}
