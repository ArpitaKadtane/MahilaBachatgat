import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSavingComponent } from './credit-saving.component';

describe('CreditSavingComponent', () => {
  let component: CreditSavingComponent;
  let fixture: ComponentFixture<CreditSavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditSavingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
