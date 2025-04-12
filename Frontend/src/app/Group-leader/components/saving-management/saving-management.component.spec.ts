import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingManagementComponent } from './saving-management.component';

describe('SavingManagementComponent', () => {
  let component: SavingManagementComponent;
  let fixture: ComponentFixture<SavingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
