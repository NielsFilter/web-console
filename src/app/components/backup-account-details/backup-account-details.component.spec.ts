import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupAccountDetailsComponent } from './backup-account-details.component';

describe('BackupAccountDetailsComponent', () => {
  let component: BackupAccountDetailsComponent;
  let fixture: ComponentFixture<BackupAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
