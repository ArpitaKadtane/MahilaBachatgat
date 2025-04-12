import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingLoanComponent } from './saving-loan.component';

describe('SavingLoanComponent', () => {
  let component: SavingLoanComponent;
  let fixture: ComponentFixture<SavingLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingLoanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavingLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
