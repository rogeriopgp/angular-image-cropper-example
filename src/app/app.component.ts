import { Component } from '@angular/core';

import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogPhotoComponent } from './dialog-photo/dialog-photo.component';
import { BlockBlobClient } from '@azure/storage-blob';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'image-cropper';

  imageCropped: SafeUrl;

  matDialogRef: MatDialogRef<DialogPhotoComponent>;

  SasAzure: string;

  constructor(public dialog: MatDialog) {}


  openDialog() {
    this.matDialogRef = this.dialog.open(DialogPhotoComponent,
        {
          disableClose: true,
          maxWidth: '100vw',
          maxHeight: '95vh'
        }
    );

    this.matDialogRef.afterClosed()
        .subscribe(value => {
          if (value!=null){
              console.log(this.imageCropped);
              this.imageCropped = value;
          }
        });
  }

  onLoad(event: any) {
      console.log(event);
  }

  sendImageToAzure() {
        const client = new BlockBlobClient(this.SasAzure);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.imageCropped as string , true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
          if (this.status == 200) {
            console.log(this.response.size);
            const response = client.upload(this.response, this.response.size ,
                { onProgress: function (value){
                      console.log(value)}
                })
            .then((value) => {console.log(value)})
            .catch((error) => console.error(error));
          }
        };
        xhr.send();
  }
}
