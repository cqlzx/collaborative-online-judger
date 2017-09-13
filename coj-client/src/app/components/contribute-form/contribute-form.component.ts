import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Problem } from '../../models/problem.model';
import { Router } from '@angular/router';

const DEFAULT_PROBLEM = Object.freeze({
  id: 0,
  name: '',
  description: '',
  difficulty: 'easy'
});

@Component({
  selector: 'app-contribute-form',
  templateUrl: './contribute-form.component.html',
  styleUrls: ['./contribute-form.component.css']
})
export class ContributeFormComponent implements OnInit {
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];
  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  addProblem(): void {
    this.dataService.addProblem(this.newProblem);
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
    this.router.navigate(['/problems']);
  }

}
