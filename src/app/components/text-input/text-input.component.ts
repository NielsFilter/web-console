import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit, OnChanges {
  @Input() placeholderText: string;

  // Value of textbox
  @Input() value: string;

  // Component output event notifying parent of changes
  @Output() valueChange = new EventEmitter<any>();


  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges() {

  }

  emitChange(event?: any): void {
    // this.value = event.target.value;
    this.valueChange.emit(event);
  }
}
