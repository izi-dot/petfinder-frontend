import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { NewPostRequest, Post } from '../domains';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpService: HttpClientService) {}

  getPosts(searchQuery?: string): Observable<Post[]> {
    return this.httpService.getWithParams<Post[]>('/posts', {search: searchQuery});
  }

  createPost(request: NewPostRequest): Observable<void> {
    return this.httpService.post<void>('/post', request);
  }
}
