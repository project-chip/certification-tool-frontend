import { Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";

@Directive({
  selector: "[streamSrc]",
})
export class StreamSrcDirective implements OnInit, OnDestroy {
  @Input("streamSrc") stream$!: Observable<MediaStream | null>;

  private sub?: Subscription;

  constructor(private el: ElementRef<HTMLVideoElement>) {}

  ngOnInit() {
    this.sub = this.stream$.subscribe((stream) => {
      this.el.nativeElement.srcObject = stream ?? null;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
