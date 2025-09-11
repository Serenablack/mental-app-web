import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MoodEntryService, MoodEntryCreateRequest } from '../../core/services/mood-entry.service';
import { EmotionService, Emotion } from '../../core/services/emotion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-mood-log',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSliderModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mood-log.component.html',
  styleUrls: ['./mood-log.component.css'],
})
export class MoodLogComponent implements OnInit, OnDestroy {
  moodForm: FormGroup;
  availableEmotions: Emotion[] = [];
  selectedEmotions: string[] = [];
  isSubmitting = false;
  isRecording = false;
  recordingTime = 0;
  private recordingInterval: any;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private moodEntryService: MoodEntryService,
    private emotionService: EmotionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.moodForm = this.fb.group({
      emotionKeys: [[], [Validators.required, Validators.minLength(1)]],
      location: [''],
      environment: ['ALONE', Validators.required],
      description: ['', Validators.maxLength(5000)],
      energyLevel: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      isVoiceInput: [false],
    });
  }

  ngOnInit(): void {
    this.loadEmotions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }
  }

  private loadEmotions(): void {
    this.emotionService
      .getAvailableEmotions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (emotions) => {
          this.availableEmotions = emotions;
        },
        error: (error) => {
          console.error('Error loading emotions:', error);
          this.snackBar.open('Error loading emotions. Please try again.', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  onEmotionToggle(emotionKey: string): void {
    const currentEmotions = this.moodForm.get('emotionKeys')?.value || [];
    const index = currentEmotions.indexOf(emotionKey);
    
    if (index > -1) {
      currentEmotions.splice(index, 1);
    } else {
      currentEmotions.push(emotionKey);
    }
    
    this.selectedEmotions = currentEmotions;
    this.moodForm.patchValue({ emotionKeys: currentEmotions });
  }

  isEmotionSelected(emotionKey: string): boolean {
    return this.selectedEmotions.includes(emotionKey);
  }

  startVoiceRecording(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      this.isRecording = true;
      this.recordingTime = 0;
      
      this.recordingInterval = setInterval(() => {
        this.recordingTime++;
      }, 1000);

      // TODO: Implement actual speech recognition
      this.snackBar.open('Voice recording started. Please speak now.', 'Close', {
        duration: 2000,
      });

      // Simulate voice input for now
      setTimeout(() => {
        this.stopVoiceRecording();
        this.moodForm.patchValue({ 
          description: 'Voice input: I am feeling quite good today, though a bit tired.',
          isVoiceInput: true 
        });
      }, 3000);
    } else {
      this.snackBar.open('Speech recognition is not supported in your browser.', 'Close', {
        duration: 3000,
      });
    }
  }

  stopVoiceRecording(): void {
    this.isRecording = false;
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
  }

  formatRecordingTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onSubmit(): void {
    if (this.moodForm.invalid) {
      this.moodForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const moodData: MoodEntryCreateRequest = this.moodForm.value;

    this.moodEntryService.createMoodEntry(moodData).subscribe({
      next: (response) => {
        this.snackBar.open('Mood entry created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating mood entry:', error);
        this.snackBar.open('Error creating mood entry. Please try again.', 'Close', {
          duration: 3000,
        });
        this.isSubmitting = false;
      },
    });
  }

  getEmotionById(emotionKey: string): Emotion | undefined {
    return this.availableEmotions.find(e => e.key === emotionKey);
  }

  getEmotionColor(emotionKey: string): string {
    // Simple color mapping for emotions
    const colors: { [key: string]: string } = {
      joy: '#fbbf24',
      sadness: '#60a5fa',
      anger: '#f87171',
      fear: '#a78bfa',
      surprise: '#fbbf24',
      trust: '#34d399',
      anticipation: '#fbbf24',
      disgust: '#f87171',
    };
    
    return colors[emotionKey] || '#667eea';
  }
}
