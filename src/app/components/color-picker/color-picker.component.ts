import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {ColorEvent} from 'ngx-color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Input() color = '#000000';
  @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('class.is-removing') isRemoving = false;
  @HostBinding('class.is-showing-color-picker') isShowingColorPicker = false;

  toggle() {
    setTimeout(() => {
      this.isShowingColorPicker = !this.isShowingColorPicker;
    }, 0);
  }

  onChange(event: ColorEvent) {
    this.colorChange.emit(event.color.hex);
  }

  onRemoveClick() {
    this.isRemoving = true;

    if (this.isShowingColorPicker) {
      this.isShowingColorPicker = false;
    }

    setTimeout(() => {
      this.isRemoving = false;
      this.removeClicked.emit();
    }, 350);
  }
}
