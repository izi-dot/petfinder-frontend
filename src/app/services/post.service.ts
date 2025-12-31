import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Post } from '../domains';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpService: HttpClientService) {}

  getPosts(): Observable<Post[]> {
    return this.httpService.get<Post[]>('/posts');
  }

}
