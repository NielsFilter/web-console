import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupAccountManagementPageComponent } from './backup-account-management-page.component';

describe('ManagementPageComponent', () => {
  let component: BackupAccountManagementPageComponent;
  let fixture: ComponentFixture<BackupAccountManagementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupAccountManagementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupAccountManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
