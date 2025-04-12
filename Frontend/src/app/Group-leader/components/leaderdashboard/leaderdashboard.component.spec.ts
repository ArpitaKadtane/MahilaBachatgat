import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderdashboardComponent } from './leaderdashboard.component';

describe('LeaderdashboardComponent', () => {
  let component: LeaderdashboardComponent;
  let fixture: ComponentFixture<LeaderdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaderdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
