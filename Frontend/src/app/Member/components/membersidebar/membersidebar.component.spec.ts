import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersidebarComponent } from './membersidebar.component';

describe('MembersidebarComponent', () => {
  let component: MembersidebarComponent;
  let fixture: ComponentFixture<MembersidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembersidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
