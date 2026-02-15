import { Component } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { AddCommentRequest, Post } from '../../domains';
import { PostService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-detail-page',
  imports: [PostComponent, ReactiveFormsModule],
  templateUrl: './post-detail-page.component.html',
  styleUrl: './post-detail-page.component.scss',
})
export class PostDetailPageComponent {
  
  post?: Post;
  form: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private postService: PostService, 
    private route: ActivatedRoute) {
      
    this.form = this.fb.group({
      comment: ['', [Validators.required,]],
    });

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.getPost(postId);
    }
  }
  
  getPost(id: string): void {
    this.postService.getPost(id).subscribe(post => this.post = post);
  }

  sendComment(): void {
    if (this.form.valid && this.post && this.post.id) {
      const comment = this.form.get('comment')?.value;
      const request: AddCommentRequest = {
        postId: this.post.id,
        comment: comment
      };
      this.postService.sendComment(request).subscribe(() => {
        if (this.post && this.post.id) {
          this.getPost(this.post.id);
        }
        this.form.reset();
      });
    }
  }
  
}