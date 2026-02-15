import { Component, Input } from '@angular/core';
import { Post } from '../../domains';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {

  @Input({required: true})
  post?: Post;

  constructor(private router: Router) {}
  
  openPostDetail(): void {
    this.router.navigate(['/post', this.post?.id]);
  }

  getLocalTimeString(): string | undefined {
    if (this.post?.createdAt) {
      return new Date(this.post?.createdAt).toLocaleString('sk');
    }
    return this.post?.createdAt;
  }
}