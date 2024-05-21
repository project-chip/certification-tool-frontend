import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component ({
  selector: 'app-performance-test-execution-tree-details',
  templateUrl: './performance-test-execution-tree-details.component.html',
  styleUrls: ['./performance-test-execution-tree-details.component.scss']
})
export class PerformanceTestExecutionTreeDetailsComponent implements OnChanges {
  @Input() testItem: any;
  p50 = 10.000.toFixed(3); // TODO: Placeholder. Change accordingly to the percentile
  p95 = 25.000.toFixed(3); // TODO: Placeholder. Change accordingly to the percentile
  p99 = 80.000.toFixed(3); // TODO: Placeholder. Change accordingly to the percentile

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.testItem.currentValue);
  }

  get totalIterations() {
    return this.testItem.length;
  }

  get progress() {
    return this.executedIterations/this.totalIterations*100;
  }

  get passedIterations() {
    return this.testItem.filter((i: any) => i.status === 'passed').length;
  }

  get failedIterations() {
    return this.testItem.filter((i: any) => i.status === 'failed').length;
  }

  get executedIterations() {
    return this.testItem.filter((i: any) => i.status !== 'pending').length;
  }

  get successRate() {
    return ((this.passedIterations/(this.passedIterations + this.failedIterations) || 0) * 100).toFixed(0);
  }
}
