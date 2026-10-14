import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialogComponent implements AfterViewInit {
  @Input() title = 'Confirmar eliminación';
  @Input() message = '';
  @Input() confirmLabel = 'Eliminar';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @ViewChild('cancelButton') private cancelButton!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    this.cancelButton.nativeElement.focus();
  }

  keepFocusInside(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelled.emit();
      return;
    }

    if (event.key !== 'Tab') return;

    const dialog = event.currentTarget as HTMLElement;
    const buttons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button'));
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && dialog.ownerDocument.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && dialog.ownerDocument.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}
