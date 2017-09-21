import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})

export class ProblemListComponent implements OnDestroy, OnInit {
  problems: Problem[];
  subscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getProblem();
  }

  private getProblem(): void {
    this.subscription = this.dataService.getProblems()
      .subscribe(problems => this.problems = problems);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
