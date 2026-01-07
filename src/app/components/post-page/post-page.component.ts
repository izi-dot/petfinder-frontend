import { Component } from '@angular/core';
import { Post } from '../../domains';
import { PostService } from '../../services';
import { PostComponent } from '../post/post.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CreatePostModalComponent } from '../create-post-modal.component/create-post-modal.component';

@Component({
  selector: 'app-post-page',
  imports: [PostComponent],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})

export class PostPageComponent {

  posts?: Post[];

  constructor(
    private postService: PostService,
    private dialog: MatDialog) {

    this.getPosts();
  }

  getPosts(): void {
    this.postService.getPosts().subscribe(posts => this.posts = posts);
  }

  openAddPetDialog() {
    this.dialog.open(CreatePostModalComponent, {
      width: '50vw',
      height: '80vh',
      maxWidth: 'none',
      panelClass: 'custom-dialog',
      disableClose: true
    }).afterClosed().subscribe(result => {
      this.getPosts();
    });
  }
}
