import { Component } from '@angular/core';
import { Post } from '../../domains';
import { PostService } from '../../services';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-page',
  imports: [PostComponent],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})

export class PostPageComponent {

  posts?: Post[];

  constructor(private postService: PostService) {
    postService.getPosts().subscribe(posts => this.posts = posts);
  }
}
