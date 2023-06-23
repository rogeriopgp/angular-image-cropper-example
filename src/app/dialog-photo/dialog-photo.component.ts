import { Component, SecurityContext } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-dialog-photo',
  templateUrl: './dialog-photo.component.html',
  styleUrls: ['./dialog-photo.component.css']
})
export class DialogPhotoComponent {

  title: string = "Image";
  textButtonLoad: string = "Load";
  textButtonSave: string = "Save";
  textButtonCancel: string = "Cancel"
  textRotateLeft: string = "Rotate left";
  textRotateRight: string = "Rotate right";
  textZoomIn: string = "Zoom in";
  textZoomOut: string = "Zoom out";
  textResetImage: string = "Reset image"
  noImageTitle: string = "No image loaded!";
  noImageDetail: string = "To load an image, please press the load button.";
  sizeFileErrorTitle: string = "File size not allowed!";
  typeFileErrorTitle: string = "File type not allowed!";
  resolutionFileErrorTitle: string = "Resolution of image not allowed!";

  imageChangedEvent: any = null;
  croppedImage: SafeUrl = null;
  imageWasLoaded: boolean = false;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  containWithinAspectRatio = false;

  fileLoaded: File = null;
  fileSizeAllowed: number = 20000000; //bytes
  fileSizeError: boolean = false;

  fileTypeError: boolean = false;
  fileTypesAllowed: string[] = ["image/jpg", "image/jpeg", "image/png"]; //mime type

  fileResolutionError: boolean = false;
  fileMinWidth: number = 80;
  fileMinHeight: number = 80;
  fileMaxWidth: number = 10000;
  fileMaxHeight: number = 10000;

  constructor(public dialogRef: MatDialogRef<DialogPhotoComponent>,
                private sanitizer: DomSanitizer) {

  }

    imageCropped(event: ImageCroppedEvent) {
         this.croppedImage = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(event.objectUrl));
         console.log(this.croppedImage);
    }

    imageLoaded() {
        this.imageWasLoaded  = true;
    }

    cropperReady() {
        // cropper ready
    }

    loadImageFailed() {
      this.imageWasLoaded = true;
    }

    inputFileChange(fileInputEvent: any) {
        this.fileLoaded = fileInputEvent?.target?.files[0];
        this.validateFileAsync().then(value => {
            if (value == true) {
              this.imageWasLoaded = true;
              this.imageChangedEvent = fileInputEvent;
            }
            else {
              this.imageWasLoaded = false;
              this.imageChangedEvent = null;
            }});
    }

    rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
    }

    zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    onSave() {
      this.validateFileAsync().then(value => {
          if (value == false) {
              return;
          }
          else {
            this.dialogRef.close(this.croppedImage ?? null);
          }
      })
    }

    onCancel() {
      this.dialogRef.close(null);
    }

    private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };

    }

    private validateFileAsync(): Promise<Boolean> {
      this.setToFalseErrorFile();
      return Promise.resolve()
          .then(() => {
              return this.validateFileSize();
          })
          .then(() => {
              return this.validateTypeImage();
          })
          .then(() => {
              return this.validateWidhtHeightImageAsync();
          })
          .catch(() => {
              return false;
          })
    }

    private setToFalseErrorFile() {
      this.fileResolutionError = false;
      this.fileSizeError = false;
      this.fileTypeError = false;
    }

    private validateFileSize(): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
              this.fileSizeError = (this.fileLoaded?.size > this.fileSizeAllowed);
              if (this.fileSizeError) {
                  reject(false);
              }
              else {
                  resolve(true);
              }
        })
    }

    private validateTypeImage(): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            this.fileTypeError = this.fileTypesAllowed.find(p => p == this.fileLoaded?.type) == undefined;
            if (this.fileTypeError) {
                reject(false);
            }
            else {
                resolve(true);
            }
        });
    }

    private validateWidhtHeightImageAsync() {
      return new Promise<Boolean>((resolve, reject) => {
        let img = new Image();
        img.src = window.URL.createObjectURL(this.fileLoaded);
        img.onload = () => {
          this.fileResolutionError = (img.width < this.fileMinWidth || img.height < this.fileMinHeight) ||
                                     ((img.width > this.fileMaxWidth && this.fileMaxWidth > 0) || (img.height > this.fileMaxHeight && this.fileMaxHeight > 0));
          if (this.fileResolutionError) {
              reject(false)
          }
          else {
              resolve(true);
          }
        };
        img.onerror = () => {
            reject(false);
        }
      })
    }

}
