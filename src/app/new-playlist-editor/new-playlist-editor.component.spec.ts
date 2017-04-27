import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlaylistEditorComponent } from './new-playlist-editor.component';

describe('NewPlaylistEditorComponent', () => {
  let component: NewPlaylistEditorComponent;
  let fixture: ComponentFixture<NewPlaylistEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPlaylistEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlaylistEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
