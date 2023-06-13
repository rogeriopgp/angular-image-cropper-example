import { Component } from '@angular/core';

import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogPhotoComponent } from './dialog-photo/dialog-photo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'image-cropper';

  imageCropped: any;

  matDialogRef: MatDialogRef<DialogPhotoComponent>;

  constructor(public dialog: MatDialog) {}


  openDialog() {
    this.matDialogRef = this.dialog.open(DialogPhotoComponent,
        {
          disableClose: true,
          maxWidth: '100vw'
        }
    );

    this.matDialogRef.afterClosed()
        .subscribe(value => {
          if (value!=null){
              this.imageCropped = value;
          }
        });
  }
}
