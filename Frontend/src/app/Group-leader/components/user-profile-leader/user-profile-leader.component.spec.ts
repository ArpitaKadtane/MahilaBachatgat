import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileLeaderComponent } from './user-profile-leader.component';

describe('UserProfileLeaderComponent', () => {
  let component: UserProfileLeaderComponent;
  let fixture: ComponentFixture<UserProfileLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileLeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProfileLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
