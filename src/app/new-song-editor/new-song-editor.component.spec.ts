import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSongEditorComponent } from './new-song-editor.component';

describe('NewSongEditorComponent', () => {
  let component: NewSongEditorComponent;
  let fixture: ComponentFixture<NewSongEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSongEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSongEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
