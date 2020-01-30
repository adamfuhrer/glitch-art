import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() appClickOutside: EventEmitter<any> = new EventEmitter();
  private localEvent = null;
  private isClickFromWithinColorPicker = false;

  @HostListener('click', ['$event']) trackEvent(event: any) {
    this.localEvent = event;
  }

  @HostListener('document:click', ['$event']) compareEvent(event: any) {
    if (event !== this.localEvent && !this.isClickFromWithinColorPicker) {
      this.appClickOutside.emit(event);
    }

    this.localEvent = null;
  }

  // Prevent the action of mousedown then mouseup outside of a color picker which would trigger the directive
  @HostListener('document:mousedown', ['$event']) mousedown(event: any) {
    if (event.target) {
      this.isClickFromWithinColorPicker = this.hasParentElement(event.target, 'color-chrome');
    }
  }

  @HostListener('document:mouseup', ['$event']) mouseup(event: any) {
    if (event.target && this.isClickFromWithinColorPicker && this.hasParentElement(event.target, 'color-chrome')) {
      this.isClickFromWithinColorPicker = false;
    }
  }

  hasParentElement(element, parentTag): boolean {
    while (element.parentNode) {
      element = element.parentNode;

      if (element.nodeName.toLowerCase() === parentTag) {
        return true;
      }
    }
    return false;
  }
}
