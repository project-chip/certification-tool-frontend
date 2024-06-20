import { NONE_TYPE } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';


@Component ({
  selector: 'app-performance-test-execution-tree-details',
  templateUrl: './performance-test-execution-tree-details.component.html',
  styleUrls: ['./performance-test-execution-tree-details.component.scss']
})
export class PerformanceTestExecutionTreeDetailsComponent {
  @Input() testItem: any;
  @Input() item: any;

  constructor(public testRunAPI: TestRunAPI,) { }

  get totalIterations() {
    return this.testItem.length - 2;
  }

  get progress() {
    return this.executedIterations/this.totalIterations*100;
  }

  get passedIterations() {
    return this.testItem.filter((i: any) => i.status === 'passed' && i.name !== "Start Performance test" && i.name !== "Show test logs").length;
  }

  get failedIterations() {
    return this.testItem.filter((i: any) => i.status === 'failed' && i.name !== "Start Performance test" && i.name !== "Show test logs").length;
  }

  get executedIterations() {
    return this.testItem.filter((i: any) => i.status !== 'pending' && i.name !== "Start Performance test" && i.name !== "Show test logs").length;
  }

  get p50() {
    if (this.item.analytics !== NONE_TYPE) {
      return  this.item.analytics['p50']
    } else {
      return "0"
    }
  }

  get p95() {
    if (this.item.analytics) {
      return  this.item.analytics['p95']
    } else {
      return "0"
    }
  }

  get p99() {
    if (this.item.analytics) {
      return  this.item.analytics['p99']
    } else {
      return "0"
    }
  }

  get unit() {
    if (this.item.analytics) {
      return  this.item.analytics['unit']
    } else {
      return "us"
    }
  }
  get successRate() {
    return ((this.passedIterations/(this.passedIterations + this.failedIterations) || 0) * 100).toFixed(0);
  }
}
