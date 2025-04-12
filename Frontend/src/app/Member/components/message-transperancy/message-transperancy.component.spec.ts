import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTransperancyComponent } from './message-transperancy.component';

describe('MessageTransperancyComponent', () => {
  let component: MessageTransperancyComponent;
  let fixture: ComponentFixture<MessageTransperancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageTransperancyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageTransperancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
