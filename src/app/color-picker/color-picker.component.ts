import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Input() color = '#000000';
  @Output() onColorChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('class.is-removing') isRemoving = false;

  onChange(color: string) {
    this.onColorChange.emit(color);
  }

  onRemoveClick() {
    this.isRemoving = true;

    setTimeout(() => {
      this.isRemoving = false;
      this.removeClicked.emit();
    }, 350);
  }

  // Returns a fill color based on the hex value of the background
  getTextColorHex(backgroundColor: string) {
    const hexRegex = /^#?[a-f0-9]{6}$/i;
    const rgbRegex = /[a-f0-9]{2}/gi;
    if (hexRegex.test(backgroundColor)) {
      const rgb = backgroundColor.match(rgbRegex);
      const responseColor: number[] = [];
      let luminosity: number;

      for (let i = 0; i < rgb.length; i++) {
        const part = parseInt(rgb[i], 16) / 255;
        if (part <= 0.03928 ) {
          responseColor.push(part / 12.92);
        } else {
          responseColor.push(Math.pow((part + 0.055) / 1.055, 2.4));
        }
      }
      luminosity = 0.2126 * responseColor[0] + 0.7152 * responseColor[1] + 0.0722 * responseColor[2];
      return luminosity > 0.279 ? '#000000' : '#FFFFFF';
    }
  }
}
