import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private recognition: any;
  private isListening = false;

  private resultSubject = new Subject<string>();
  private errorSubject = new Subject<any>();
  private endSubject = new Subject<void>();

  public result$ = this.resultSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public end$ = this.endSubject.asObservable();

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          this.resultSubject.next(finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.errorSubject.next(event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.endSubject.next();
      };
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  start(): void {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isListeningNow(): boolean {
    return this.isListening;
  }
}
