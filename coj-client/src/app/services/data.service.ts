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
}
