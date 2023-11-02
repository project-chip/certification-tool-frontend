import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output() fileDrop = new EventEmitter<any>();
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    const drop = { 'target': { 'files': evt.dataTransfer.files } };
    if (evt.dataTransfer.files.length > 0) {
      this.fileDrop.emit(drop);
    }
  }
}
