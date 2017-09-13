import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { PROBLEMS } from '../mock.data';

@Injectable()
export class DataService {
  problems: Problem[] = PROBLEMS;
  constructor() { }

  getProblems(): Problem[] {
    return this.problems;
  }
  getProblem(id: number): Problem {
    return this.problems.find((problem) => problem.id === id);
  }

  addProblem(newProblem: Problem): void {
    newProblem.id = this.problems.length + 1;
    this.problems.push(newProblem);
  }
}
