import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css']
})
export class PasswordInputComponent implements OnInit {

  constructor() { }
  @Input() value: string;
  @Output() valueChange = new EventEmitter<any>();
  ngOnInit() {
  }

  emitChange(event: any): void {
    // this.value = event.target.value;
    this.valueChange.emit(event);
  }
}
