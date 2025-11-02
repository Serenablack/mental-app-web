import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
  ],
  templateUrl: './mood-entry-form.component.html',
  styleUrls: ['./mood-entry-form.component.css'],
})
export class MoodEntryFormComponent implements OnInit {
  moodForm: FormGroup;
  availableEmotions: any[] = [];
  primaryEmotions: any[] = [];
  subEmotions: any[] = [];
  selectedPrimaryEmotion: any = null;
  selectedEmotions: string[] = [];
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  entryId?: number;
  isRecording: boolean = false;
  recognition: any;
  private emotionParentMap: Map<number, number> = new Map();
  private allLoadedSubEmotions: Map<number, any> = new Map();
  energyLevelValue: number = 3;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private moodEntryService: MoodEntryService,
    private emotionService: EmotionService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.moodForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEmotions();
    this.checkEditMode();
    this.setupFormListeners();
    this.initializeVoiceRecognition();

    this.energyLevelValue = this.moodForm.get('energyLevel')?.value || 3;

    this.moodForm.get('energyLevel')?.valueChanges.subscribe((value) => {
      if (value !== null && value !== undefined) {
        this.energyLevelValue = value;
      }
    });

    this.cdr.detectChanges();
  }

  /**
   * Create the reactive form
   */
  createForm(): FormGroup {
    return this.fb.group({
      emotionIds: [[], [Validators.required, Validators.minLength(1)]],
      energyLevel: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comfortEnvironment: ['ALONE', Validators.required],
      location: ['', Validators.maxLength(255)],
      passion: [''],
      isVoiceInput: [false],
    });
  }

  /**
   * Load available emotions
   */
  loadEmotions(): void {
    this.emotionService.getPrimaryEmotions().subscribe({
      next: (emotions) => {
        this.primaryEmotions = emotions;
        this.availableEmotions = emotions;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading primary emotions:', error);
        this.snackBar.open(
          'Failed to load emotions. Please refresh the page.',
          'Close',
          { duration: 5000 }
        );
      },
    });
  }

  loadSubEmotions(primaryEmotion: any): void {
    if (!primaryEmotion || !primaryEmotion.key) {
      this.subEmotions = [];
      this.availableEmotions = this.primaryEmotions;
      this.selectedPrimaryEmotion = null;
      return;
    }

    this.selectedPrimaryEmotion = primaryEmotion;

    this.emotionService.getSubEmotions(primaryEmotion.key).subscribe({
      next: (subEmotions) => {
        this.subEmotions = subEmotions;
        this.availableEmotions = subEmotions;

        subEmotions.forEach((subEmotion) => {
          this.emotionParentMap.set(subEmotion.id, primaryEmotion.id);
          this.allLoadedSubEmotions.set(subEmotion.id, subEmotion);
        });

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          `Error loading sub-emotions for ${primaryEmotion.label}:`,
          error
        );
        this.selectedPrimaryEmotion = null;
        this.snackBar.open(
          'Failed to load sub-emotions. Please try again.',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  onPrimaryEmotionChange(emotion: any): void {
    this.loadSubEmotions(emotion);
  }

  onEnergyLevelChange(value: number | null): void {
    if (value !== null && value !== undefined) {
      const energyControl = this.moodForm.get('energyLevel');
      if (energyControl) {
        energyControl.setValue(value, { emitEvent: true, onlySelf: false });
        energyControl.markAsTouched();
        // Force change detection
        this.cdr.detectChanges();
      }
    }
  }

  onEnergyLevelSliderChange(value: number | null): void {
    if (value !== null && value !== undefined) {
      // Update the component property
      this.energyLevelValue = value;

      // Update the form control
      const energyControl = this.moodForm.get('energyLevel');
      if (energyControl) {
        energyControl.setValue(value, { emitEvent: true, onlySelf: false });
        energyControl.markAsTouched();
        // Force change detection
        this.cdr.detectChanges();
      }
    }
  }

  hasSelectedSubEmotions(primaryEmotionId: number): boolean {
    const selectedIds = this.moodForm.get('emotionIds')?.value || [];
    if (selectedIds.length === 0) return false;

    return selectedIds.some((id: number) => {
      const parentId = this.emotionParentMap.get(id);
      return parentId === primaryEmotionId;
    });
  }

  onSubEmotionChange(emotion: any): void {
    const currentEmotions = this.moodForm.get('emotionIds')?.value || [];

    const index = currentEmotions.indexOf(emotion.id);
    if (index > -1) {
      currentEmotions.splice(index, 1);
    } else {
      currentEmotions.push(emotion.id);
    }

    this.moodForm.patchValue({ emotionIds: currentEmotions });
  }

  isEmotionSelected(emotionId: number): boolean {
    const currentEmotions = this.moodForm.get('emotionIds')?.value || [];
    return currentEmotions.includes(emotionId);
  }

  goBackToPrimaryEmotions(): void {
    this.availableEmotions = this.primaryEmotions;
    this.subEmotions = [];
    this.selectedPrimaryEmotion = null;
  }

  getSelectedEmotionLabels(): string[] {
    return this.getSelectedEmotionsWithDetails().map((e) => e.label);
  }

  getSelectedEmotionsWithDetails(): Array<{
    id: number;
    label: string;
    primaryLabel?: string;
  }> {
    const selectedIds = this.moodForm.get('emotionIds')?.value || [];
    if (selectedIds.length === 0) return [];

    const emotions: Array<{
      id: number;
      label: string;
      primaryLabel?: string;
    }> = [];

    selectedIds.forEach((id: number) => {
      const subEmotion = this.allLoadedSubEmotions.get(id);
      if (subEmotion) {
        const parentId = this.emotionParentMap.get(id);
        const parentEmotion = this.primaryEmotions.find(
          (e) => e.id === parentId
        );

        emotions.push({
          id: subEmotion.id,
          label: subEmotion.label,
          primaryLabel: parentEmotion?.label,
        });
        return;
      }

      const primaryEmotion = this.primaryEmotions.find((e) => e.id === id);
      if (primaryEmotion) {
        emotions.push({
          id: primaryEmotion.id,
          label: primaryEmotion.label,
        });
      }
    });

    return emotions;
  }

  removeSelectedEmotion(emotionId: number): void {
    const currentEmotions = this.moodForm.get('emotionIds')?.value || [];
    const filtered = currentEmotions.filter((id: number) => id !== emotionId);
    this.moodForm.patchValue({ emotionIds: filtered });
  }

  /**
   * Format energy level label for slider (1-5 scale)
   */
  formatEnergyLabel(value: number): string {
    switch (value) {
      case 1:
        return 'Very Low';
      case 2:
        return 'Low';
      case 3:
        return 'Moderate';
      case 4:
        return 'High';
      case 5:
        return 'Very High';
      default:
        return 'Moderate';
    }
  }

  /**
   * Get energy level description
   */
  getEnergyDescription(value: number): string {
    switch (value) {
      case 1:
        return 'Feeling drained, very tired';
      case 2:
        return 'Low energy, feeling sluggish';
      case 3:
        return 'Normal energy level';
      case 4:
        return 'Feeling energetic and active';
      case 5:
        return 'Very energetic, full of vitality';
      default:
        return 'Normal energy level';
    }
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
      console.log(
        'Energy level value:',
        this.moodForm.get('energyLevel')?.value
      );

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
  createMoodEntry(formData: any): void {
    const moodEntryRequest = {
      emotionIds: formData.emotionIds || [],
      energyLevel: formData.energyLevel,
      comfortEnvironment: formData.comfortEnvironment,
      location: formData.location || '',
      description: formData.description || '',
      passion: formData.passion || '',
    };

    this.moodEntryService.createMoodEntry(moodEntryRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.snackBar.open('Mood entry created successfully! 🎉', 'Close', {
          duration: 4000,
          panelClass: ['success-snackbar'],
        });

        this.resetForm();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating mood entry:', error);
        this.handleApiError(error, 'Failed to create mood entry');
      },
    });
  }

  /**
   * Handle API errors with user-friendly messages
   */
  private handleApiError(error: any, defaultMessage: string): void {
    let message = defaultMessage;

    if (error?.status === 401) {
      message = 'Please log in again to continue';
      setTimeout(() => this.router.navigate(['/auth']), 2000);
    } else if (error?.status === 400) {
      message = 'Please check your input and try again';
    } else if (error?.status === 422) {
      message = 'Validation error. Please check your input data';
    } else if (error?.status === 0) {
      message =
        'Unable to connect to server. Please check your internet connection';
    } else if (error?.message) {
      message = error.message;
    } else if (error?.details) {
      message = error.details;
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * Reset the form to its initial state
   */
  private resetForm(): void {
    this.moodForm.reset();
    this.moodForm.patchValue({
      emotionIds: [],
      energyLevel: 3,
      comfortEnvironment: 'ALONE',
      location: '',
      description: '',
      passion: '',
      isVoiceInput: false,
    });
    this.goBackToPrimaryEmotions();
  }

  /**
   * Update existing mood entry
   */
  updateMoodEntry(entry: Partial<MoodEntry>): void {
    setTimeout(() => {
      this.isSubmitting = false;
      this.snackBar.open('Mood entry updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

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

  /**
   * Initialize voice recognition
   */
  initializeVoiceRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const currentDescription =
          this.moodForm.get('description')?.value || '';
        this.moodForm.patchValue({
          description:
            currentDescription + (currentDescription ? ' ' : '') + transcript,
        });
        this.isRecording = false;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        this.isRecording = false;
        this.snackBar.open(
          'Voice recognition failed. Please try again.',
          'Close',
          {
            duration: 3000,
          }
        );
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };
    }
  }

  /**
   * Start voice recording
   */
  startVoiceRecording(): void {
    if (this.recognition && !this.isRecording) {
      this.isRecording = true;
      this.recognition.start();
      this.snackBar.open('Listening... Speak now!', 'Close', {
        duration: 2000,
      });
    }
  }

  /**
   * Stop voice recording
   */
  stopVoiceRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  /**
   * Toggle input method
   */
  onInputMethodChange(): void {
    const inputMethod = this.moodForm.get('inputMethod')?.value;
    if (inputMethod === 'voice') {
      this.startVoiceRecording();
    }
  }
}
