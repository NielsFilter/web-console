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
  // NOTE: The fact that this has the word "Change" in the variable name is very important.
  //       Angular does some magic here.
  @Output() valueChange = new EventEmitter<any>();


  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges() {

  }


  emitChange(event: any): void {
    // this.value = event.target.value;
    this.valueChange.emit(event);
  }
}
