import {ChangeDetectorRef, Component, HostBinding, HostListener, OnInit} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {MatRadioChange} from '@angular/material/radio';
import html2canvas from 'html2canvas';

export interface GlitchLine {
  transform: string;
  order: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  amountOfLines = 40;
  translateAmount = 70;
  readonly panelWidth = 360;

  @HostBinding('class.is-vertical') isDirectionVertical = true;
  @HostBinding('class.is-horizontal') isDirectionHorizontal = false;

  directions = [
    { name: 'Vertical', id: 'vertical'},
    { name: 'Horizontal', id: 'horizontal'}
  ];
  corners = [
    { name: 'Rounded', id: 'rounded'},
    { name: 'Straight', id: 'straight'}
  ];
  isRoundBorder = true;

  lines: GlitchLine[] = [];
  gradient = ['#ff5555', '#ffa655', '#ffec55', '#73ff55', '#55feff', '#55c4ff', '#c171ff', '#ff55fb'];
  sampleGradients = [
    ['#ff5555', '#ffa655', '#ffec55', '#73ff55', '#55feff', '#55c4ff', '#c171ff', '#ff55fb'],
    ['#210d5f', '#5b27ff', '#2bd9ff', '#c9f5ff', '#2bd9ff', '#5b27ff', '#210d5f'],
    ['#6a0e04', '#ff4c5e', '#ffd1be'],
    ['#73066f', '#ea21a1', '#ff7986', '#efe46c'],
    // ['#7d5dff', '#2bd9ff', '#41ff95'],
    // ['#ffe850', '#ff7986', '#7917bd', '#44096c'],
    // ['#f432ab', '#541586', '#150533'],
    // ['#56ff5c', '#fcff20', '#75dd86'],
    // ['#7cd991', '#47af4a', '#1e834c', '#2c3b31', '#000000'],
  ];

  @HostBinding('class.is-generating') isGenerating = false;

  @HostListener('window:resize') onResize() {
    this.cdr.detectChanges();
  }

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.addAmountOfLines(this.amountOfLines);
  }

  onColorPickerChange(color: string, index: number) {
    this.gradient[index] = color;
  }

  onDirectionChange(change: MatRadioChange) {
    this.isDirectionHorizontal = change.value === 'Horizontal';
    this.isDirectionVertical = change.value === 'Vertical';
    this.generateLines();
  }

  onCornerChange(change: MatRadioChange) {
    this.isRoundBorder = change.value === 'Rounded';
  }

  onAmountOfLinesChange(amount: MatSliderChange) {
    if (amount.value !== this.amountOfLines) {
      if (amount.value < this.amountOfLines) {
        this.lines.splice(0, this.amountOfLines - amount.value);
      } else {
        this.addAmountOfLines(amount.value - this.amountOfLines);
      }

      this.amountOfLines = amount.value;
      this.generateLines();
    }
  }

  onTranslateXChange(amount: MatSliderChange) {
    this.translateAmount = amount.value;

    this.isGenerating = true;
    for (const line in this.lines) {
      this.lines[line].transform = this.getRandomLineTransform();
    }
    setTimeout(() => {
      this.isGenerating = false;
    }, 500);
  }

  onColorRemoveClick(index: number) {
    this.gradient.splice(index, 1);
  }

  onSampleClick(sample: string[]) {
    this.gradient = [...sample];
  }

  generateLines() {
    this.isGenerating = true;

    for (const line in this.lines) {
      this.lines[line].transform = this.getRandomLineTransform();
      this.lines[line].order = this.getRandomLineOrder();
    }

    setTimeout(() => {
      this.isGenerating = false;
    }, 500);
  }

  addAmountOfLines(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.lines.push({transform: this.getRandomLineTransform(), order: this.getRandomLineOrder()} as GlitchLine);
    }
  }

  getLineHeight(index: number) {
    const linesPerSection = this.amountOfLines / 4;
    const viewport = this.isDirectionVertical ? 'vw' : 'vh';

    if (index % 4 === 0) {
      return (0.48 / linesPerSection * 100).toString() + viewport;
    } else if (index % 4 === 1) {
      return (0.3 / linesPerSection * 100).toString() + viewport;
    } else if (index % 4 === 2) {
      return (0.16 / linesPerSection * 100).toString() + viewport;
    } else {
      return (0.06 / linesPerSection * 100).toString() + viewport;
    }
  }


  getBackgroundGradient(gradient: string[], direction: string = 'right') {
    if (gradient && gradient.length > 1) {
      let background = 'linear-gradient(to ' + direction;
      for (const color of gradient) {
        background = background + ', ' + color;
      }
      background = background + ')';
      return background;
    } else if (gradient.length === 1) {
      return gradient[0];
    }
  }

  getRandomLineOrder() {
    return this.randomNumFromInterval(1, this.amountOfLines);
  }

  getRandomLineTransform() {
    if (this.isDirectionVertical) {
      return this.randomNumFromInterval(0, 1) === 1 ?
        'translateY(' + this.randomNumFromInterval(0, this.translateAmount) + 'vh)' :
        'translateY(-' + this.randomNumFromInterval(0, this.translateAmount) + 'vh)';
    } else {
      return this.randomNumFromInterval(0, 1) === 1 ?
        'translateX(' + this.randomNumFromInterval(0, this.translateAmount) + 'vw)' :
        'translateX(-' + this.randomNumFromInterval(0, this.translateAmount) + 'vw)';
    }
  }

  onNewColorClick() {
    this.gradient.push('#000000');
  }

  onPhoneClick() {
    html2canvas(document.querySelector('#art'),
      {width: 1125, height: 2436, windowWidth: 1125 + this.panelWidth, windowHeight: 2436}).then(canvas => {
      this.saveWallpaper(canvas, 'phone');
    });
  }

  onTabletClick() {
    html2canvas(document.querySelector('#art'),
      {width: 1668, height: 2224, windowWidth: 1668 + this.panelWidth, windowHeight: 2224}).then(canvas => {
      this.saveWallpaper(canvas, 'tablet');
    });
  }

  onDesktopClick() {
    html2canvas(document.querySelector('#art'),
      {width: 2880, height: 1800, windowWidth: 2880 + this.panelWidth, windowHeight: 1800}).then(canvas => {
      this.saveWallpaper(canvas, 'desktop');
    });
  }

  saveWallpaper(canvas: HTMLCanvasElement, type: string) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
    a.download = 'glitch-art-' + type + '.jpg';
    a.click();
  }

  randomNumFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  trackColor(color: string) {
    return color;
  }
}
