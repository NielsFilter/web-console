import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetryRequestComponentComponent } from './retry-request.component';

describe('RetryRequestComponentComponent', () => {
  let component: RetryRequestComponentComponent;
  let fixture: ComponentFixture<RetryRequestComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetryRequestComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetryRequestComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
