import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  imageChangedEvent: any = null;
  croppedImage: any = null;
  imageWasLoaded: boolean = false;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  containWithinAspectRatio = false;

  fileLoaded: File = null;
  fileSizeAllowed: number = 200000; //bytes
  fileSizeError: boolean = false;

  fileTypeError: boolean = false;
  fileTypesAllowed: string[] = ["image/jpg", "image/jpeg", "image/png"]; //mime type

  constructor(public dialogRef: MatDialogRef<DialogPhotoComponent>) {

  }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
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
        if (this.validateFile()){
          this.imageWasLoaded = true;
          this.imageChangedEvent = fileInputEvent;
        }
        else {
          this.imageWasLoaded = false;
          this,this.imageChangedEvent = null;
        }
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
      if (this.fileSizeError) {
        return;
      }
      this.dialogRef.close(this.croppedImage ?? null);
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

    private validateFile(): Boolean {
        if (!this.validateFileSize()) {
            return false;
        }
        if (!this.validateTypeImage()) {
            return false;
        }
        return true;
    }

    private validateFileSize(): Boolean {
        this.fileSizeError = (this.fileLoaded?.size > this.fileSizeAllowed);
        return !this.fileSizeError;
    }

    private validateTypeImage(): Boolean {
        this.fileTypeError = this.fileTypesAllowed.find(p => p == this.fileLoaded?.type) == undefined;
        return !this.fileTypeError;
    }
}
