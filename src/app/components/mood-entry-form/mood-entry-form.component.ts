import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MoodEntryService } from '../../core/services/mood-entry.service';
import { EmotionService } from '../../core/services/emotion.service';
import { MoodEntry } from '../../core/models/mood-entry.model';

@Component({
  selector: 'app-mood-entry-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mood-entry-form.component.html',
  styleUrls: ['./mood-entry-form.component.css'],
})
export class MoodEntryFormComponent implements OnInit {
  moodForm: FormGroup;
  availableEmotions: any[] = [];
  selectedEmotions: string[] = [];
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  entryId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private moodEntryService: MoodEntryService,
    private emotionService: EmotionService,
    private snackBar: MatSnackBar
  ) {
    this.moodForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEmotions();
    this.checkEditMode();
    this.setupFormListeners();
  }

  /**
   * Create the reactive form
   */
  createForm(): FormGroup {
    return this.fb.group({
      emotionKeys: [[], [Validators.required, Validators.minLength(2)]],
      energyLevel: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      environment: ['ALONE', Validators.required],
      location: [''],
      description: ['', Validators.maxLength(5000)],
      isVoiceInput: [false],
    });
  }

  /**
   * Load available emotions
   */
  loadEmotions(): void {
    // Subscribe to the observable
    this.emotionService.getAvailableEmotions().subscribe((emotions) => {
      this.availableEmotions = emotions;
    });
  }

  /**
   * Check if we're in edit mode
   */
  checkEditMode(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.entryId = +params['id'];
        this.loadExistingEntry();
      }
    });
  }

  /**
   * Load existing entry for editing
   */
  loadExistingEntry(): void {
    if (this.entryId) {
      // For now, using mock data
      this.moodEntryService
        .getMoodEntryById(this.entryId)
        .subscribe((existingEntry) => {
          if (existingEntry) {
            this.populateForm(existingEntry);
          }
        });
    }
  }

  /**
   * Populate form with existing data
   */
  populateForm(entry: MoodEntry): void {
    this.moodForm.patchValue({
      emotionKeys: entry.emotionKeys,
      energyLevel: entry.energyLevel,
      environment: entry.environment,
      location: entry.location || '',
      description: entry.description || '',
      isVoiceInput: entry.isVoiceInput,
    });
    this.selectedEmotions = [...entry.emotionKeys];
  }

  /**
   * Setup form listeners
   */
  setupFormListeners(): void {
    this.moodForm.get('emotionKeys')?.valueChanges.subscribe((emotions) => {
      this.selectedEmotions = emotions || [];
    });
  }

  /**
   * Handle emotion checkbox changes
   */
  onEmotionChange(event: any): void {
    const emotionKey = event.source.value;
    const isChecked = event.checked;

    let currentEmotions = this.moodForm.get('emotionKeys')?.value || [];

    if (isChecked) {
      if (!currentEmotions.includes(emotionKey)) {
        currentEmotions.push(emotionKey);
      }
    } else {
      currentEmotions = currentEmotions.filter((e: string) => e !== emotionKey);
    }

    this.moodForm.patchValue({ emotionKeys: currentEmotions });
  }

  /**
   * Remove emotion from selection
   */
  removeEmotion(emotion: string): void {
    let currentEmotions = this.moodForm.get('emotionKeys')?.value || [];
    currentEmotions = currentEmotions.filter((e: string) => e !== emotion);
    this.moodForm.patchValue({ emotionKeys: currentEmotions });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.moodForm.valid) {
      this.isSubmitting = true;

      const formValue = this.moodForm.value;
      const moodEntry: Partial<MoodEntry> = {
        ...formValue,
        entryDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (this.isEditMode && this.entryId) {
        this.updateMoodEntry(moodEntry);
      } else {
        this.createMoodEntry(moodEntry);
      }
    } else {
      this.markFormGroupTouched();
      this.snackBar.open(
        'Please fill in all required fields correctly',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  /**
   * Create new mood entry
   */
  createMoodEntry(entry: Partial<MoodEntry>): void {
    // For now, using mock data
    setTimeout(() => {
      this.isSubmitting = false;
      this.snackBar.open(
        'Mood entry created successfully! AI suggestions are being generated...',
        'Close',
        {
          duration: 4000,
          panelClass: ['success-snackbar'],
        }
      );

      // Navigate back to dashboard
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    }, 2000);
  }

  /**
   * Update existing mood entry
   */
  updateMoodEntry(entry: Partial<MoodEntry>): void {
    // For now, using mock data
    setTimeout(() => {
      this.isSubmitting = false;
      this.snackBar.open('Mood entry updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      // Navigate back to dashboard
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    }, 1500);
  }

  /**
   * Cancel form submission
   */
  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  markFormGroupTouched(): void {
    Object.keys(this.moodForm.controls).forEach((key) => {
      const control = this.moodForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get form control for template access
   */
  getFormControl(name: string) {
    return this.moodForm.get(name);
  }

  /**
   * Check if form control is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.moodForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Get error message for form control
   */
  getErrorMessage(fieldName: string): string {
    const field = this.moodForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['minlength'])
        return `Minimum length is ${field.errors['minlength'].requiredLength}`;
      if (field.errors['maxlength'])
        return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
      if (field.errors['min'])
        return `Minimum value is ${field.errors['min'].min}`;
      if (field.errors['max'])
        return `Maximum value is ${field.errors['max'].max}`;
    }
    return '';
  }
}
