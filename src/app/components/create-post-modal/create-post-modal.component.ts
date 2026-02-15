import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services';
import { NewPostRequest } from '../../domains';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-create-post-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.scss',
})
export class CreatePostModalComponent {

  imagePreview: string | ArrayBuffer | null = null;

  form: FormGroup;
  animals: Record<string, string[]> = {
    cat: ['Siberian', 'Persian', 'British Shorthair'],
    dog: ['Retriever', 'Bulldog', 'Beagle'],
    parrot: ['African Grey', 'Cockatoo', 'Macaw']
  };
  breeds: string[] = [];
  

  constructor(private fb: FormBuilder,
              private postService: PostService,
              private dialog: MatDialog)   {
    this.form = this.fb.group({
      petName: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      animal: ['', Validators.required],
      breed: ['', Validators.required],
      photo: [null, Validators.required]
    });

    this.form.get('animal')?.valueChanges.subscribe(value => {
      this.breeds = this.animals[value] || [];
      this.form.get('breed')?.setValue('');
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // store file in form (for submit)
    this.form.patchValue({ photo: file });
    this.form.get('photo')?.updateValueAndValidity();

    // create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.form.patchValue({ photo: reader.result });
    };
    reader.readAsDataURL(file);
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: NewPostRequest = {
      petName: this.form.value.petName,
      animalType: this.form.value.animal,
      breed: this.form.value.breed,
      location: this.form.value.location,
      description: this.form.value.description,
      photos: this.form.value.photo
    }
    this.postService.createPost(request).subscribe({
      next: () => {
        console.log('Post created successfully');
        this.dialog.closeAll(); 
      },
      error: (error) => {
        console.error('Error creating post', error);
      }
    });
  }

  photoTouched(): void {
    this.form.get('photo')?.markAsTouched();
  }
  
} 