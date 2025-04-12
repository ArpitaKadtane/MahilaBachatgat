import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordLeaderComponent } from './change-password-leader.component';

describe('ChangePasswordLeaderComponent', () => {
  let component: ChangePasswordLeaderComponent;
  let fixture: ComponentFixture<ChangePasswordLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordLeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangePasswordLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
