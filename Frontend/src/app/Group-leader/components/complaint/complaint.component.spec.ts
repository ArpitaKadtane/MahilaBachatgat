import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintComponent } from './complaint.component';

describe('ComplaintComponent', () => {
  let component: ComplaintComponent;
  let fixture: ComponentFixture<ComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
