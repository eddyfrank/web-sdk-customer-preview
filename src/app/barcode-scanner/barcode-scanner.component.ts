import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IBarcodeScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle';
import { BarcodeResult } from 'scanbot-web-sdk/@types/model/barcode/barcode-result';
import { BarcodeScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration';
import ScanbotSDK from 'scanbot-web-sdk/webpack';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class BarcodeScannerComponent  implements OnInit {

  private scanbotSDK?: ScanbotSDK;
  private scanner?: IBarcodeScannerHandle;
  private isRearCamera = true;
  private detectionStartTime: number = 0;
  private detectionTimeTotal: number = 0;
  private numberOfDetections: number = 0;

  public ctlButtonVisible = false;
  public btnTitleScannerAction = '';
  public resultLabelText = '';
  public avgLabelText = '';

  constructor() { }

  ngOnInit() {
    this.initSdk();
  }

  private async initSdk(): Promise<void> {
    // trial key valid until 01.11.2023!
    const myLicenseKey =
      "lYE55JszB37OyFD5jCh70Jqz4tAnlO" +
      "wOLZsdFJ2Z69nrAHLkPa/PNpMjdY5u" +
      "flveeFD2ajIenv9U5ABtW113WMOERa" +
      "ATXe27XV2pymC0Sp4z44oZo/ViNL0u" +
      "z/UObbyNdm4OzX16WQs5UlmfWxvPRZ" +
      "6280pBfiO3gEi7UeKAtpepb0LHRPL6" +
      "we7HBQ8NE0c9MHXSLRr29DqN31uHrF" +
      "1N0a+gOf6JurDsCBaEs67HI5/XkI0o" +
      "PvP4m0hdtv5j0tT+DWDcq4fADCA8iH" +
      "IXp3o4AvXqakKOpYzZZW5qTXar0mTQ" +
      "TOr7/mF3Hp3vnDPgW1fiaFb1q/hhiu" +
      "0fq29Q0b/fvw==\nU2NhbmJvdFNESw" +
      "psb2NhbGhvc3R8d2ViLXNkay1wcmV2" +
      "aWV3LnNjYW5ib3QuaW8KMTY5ODg4Mz" +
      "E5OQo1MTIKOA==\n";

    this.scanbotSDK = await ScanbotSDK.initialize({
      licenseKey: myLicenseKey,
      allowThreads: true,
      // optional engine path where ScanbotSDK.Core.js and ScanbotSDK.Asm.wasm are served
      // engine: 'scanner/',
    });

    this.initBarcodeScanner(this.isRearCamera);

    setTimeout(() => {
      this.ctlButtonVisible = true;
      this.detectionStartTime = new Date().getTime();
    }, 1000);
  }

  private async initBarcodeScanner(isRearCamera: boolean): Promise<void> {
    const config: BarcodeScannerConfiguration = {
      containerId: 'scannerCam',
      mirrored: !isRearCamera,
      captureDelay: 0,
      style: {
        window: {
          borderColor: 'red',
          aspectRatio: 2,
          widthProportion: 0.8,
        },
        hint: '(SB WebSDK 3.0.0-rc.7 (w/ threads))'
      },
      videoConstraints: {
        facingMode: isRearCamera ? 'environment' : 'user',
      },
      onBarcodesDetected: this.handleDetectedBarcodes.bind(this),
      onError: e => {
        alert(JSON.stringify(e));
      }
    };
    try {
      this.scanner = await this.scanbotSDK!.createBarcodeScanner(config);
      this.btnTitleScannerAction = 'Pause scanning';
    } catch (error) {
      alert(JSON.stringify(error));
      console.log(error);
    }
  }

  private handleDetectedBarcodes(result: BarcodeResult): void {
    const detectionTime = new Date().getTime() - this.detectionStartTime;
    this.numberOfDetections++;
    this.detectionTimeTotal += detectionTime;

    // reset for the next round
    this.detectionStartTime = new Date().getTime();

    this.resultLabelText = `${result.barcodes[0].format}, in ${detectionTime / 1000} seconds`;

    if (this.numberOfDetections > 0 && this.detectionTimeTotal > 0) {
      const detectionTimeAvg = this.detectionTimeTotal / this.numberOfDetections;
      this.avgLabelText = `${detectionTimeAvg / 1000} seconds`;
    }

    //const msg = `${result.barcodes[0].format}: ${result.barcodes[0].text}\nIn ${detectionTime / 1000} seconds`;
    //console.log('Barcode scanned: ' + msg);
  }

  public async switchCamera(): Promise<void> {
    this.scanner!.dispose();
    this.isRearCamera = !this.isRearCamera;
    await this.initBarcodeScanner(this.isRearCamera);
  }

  public async togglePauseResume(): Promise<void> {
    if (this.scanner!.isDetectionPaused()) {
      this.scanner!.resumeDetection();
      this.detectionStartTime = new Date().getTime();
      this.numberOfDetections = 0;
      this.detectionTimeTotal = 0;
      this.btnTitleScannerAction = 'Pause scanning';
    } else {
      this.scanner!.pauseDetection();
      this.detectionStartTime = 0;
      this.btnTitleScannerAction = 'Resume scanning';
    }
  }

}
