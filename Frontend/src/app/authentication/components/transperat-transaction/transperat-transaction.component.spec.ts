import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransperatTransactionComponent } from './transperat-transaction.component';

describe('TransperatTransactionComponent', () => {
  let component: TransperatTransactionComponent;
  let fixture: ComponentFixture<TransperatTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransperatTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransperatTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
