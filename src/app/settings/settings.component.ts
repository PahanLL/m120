import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  accessibilityMode = JSON.parse(localStorage.getItem('accessibilityMode') || 'false');
  highContrastMode = JSON.parse(localStorage.getItem('highContrastMode') || 'false');
  lowBrightnessMode = JSON.parse(localStorage.getItem('lowBrightnessMode') || 'false');

  toggleAccessibilityMode() {
    this.updateTextSize();
    localStorage.setItem('accessibilityMode', JSON.stringify(this.accessibilityMode));
  }

  toggleHighContrastMode() {
    this.updateContrast();
    localStorage.setItem('highContrastMode', JSON.stringify(this.highContrastMode));
  }

  toggleLowBrightnessMode() {
    this.updateBrightness();
    localStorage.setItem('lowBrightnessMode', JSON.stringify(this.lowBrightnessMode));
  }

  updateTextSize() {
    if (this.accessibilityMode) {
      document.documentElement.style.setProperty('--text-size', '28px');
      document.documentElement.style.setProperty('--body-text-size', '22px');
    } else {
      document.documentElement.style.setProperty('--text-size', '16px');
      document.documentElement.style.setProperty('--body-text-size', '16px');
    }
  }

  updateContrast() {
    if (this.highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  updateBrightness() {
    if (this.lowBrightnessMode) {
      document.body.classList.add('low-brightness');
    } else {
      document.body.classList.remove('low-brightness');
    }
  }
}
