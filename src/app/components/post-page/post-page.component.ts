import { Component } from '@angular/core';
import { Post } from '../../domains';
import { PostService, AuthService } from '../../services';
import { PostComponent } from '../post/post.component';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostModalComponent } from '../create-post-modal.component/create-post-modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-page',
  imports: [PostComponent, ReactiveFormsModule],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})

export class PostPageComponent {

  posts?: Post[];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private dialog: MatDialog,
    private authService: AuthService) {

    this.form = this.fb.group({
      searchQuery: [''],
    });

    this.form.controls['searchQuery'].valueChanges.subscribe((value) => {
      this.getPosts(value);
    })
    this.getPosts();
  }

  getPosts(searchQuery?: string): void {
    this.postService.getPosts(searchQuery).subscribe(posts => this.posts = posts);
  }

  openAddPetDialog() {

    if (!this.isLoggedIn()) {
      window.alert('You must be logged in to create a post.');
      return;
    }
    this.dialog.open(CreatePostModalComponent, {
      width: '50vw',
      height: '80vh',
      maxWidth: 'none',
      panelClass: 'custom-dialog',
      // disableClose: true
    }).afterClosed().subscribe(result => {
      this.getPosts();
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
  
}