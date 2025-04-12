import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanConfirmationComponent } from './loan-confirmation.component';

describe('LoanConfirmationComponent', () => {
  let component: LoanConfirmationComponent;
  let fixture: ComponentFixture<LoanConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
