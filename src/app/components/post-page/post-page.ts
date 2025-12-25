import { Component } from '@angular/core';

@Component({
  selector: 'app-post-page',
  imports: [],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
})

export class PostPage {

  postOLD: Post;
  posts?: Post[];

  constructor() {


    this.postOLD = {
      id: "123",
      createdBy: "Martinko",
      createAt: new Date(Date.now()).toLocaleString(),
      petName: "LEO",
      location: "Dunajska Streda",
      intractionsCount: 67,
      solved: true
    };

    const post2 = {
      id: "4",
      createdBy: "Jozu kubani",
      createAt: new Date(1734977093).toLocaleString(),
      petName: "Marta",
      location: "Brunovce",
      intractionsCount: 69,
      solved: false
    };
    const post3 = {
      id: "5",
      createdBy: "Jozu kubani",
      createAt: new Date(1734977093).toLocaleString(),
      petName: "Marta",
      location: "Brunovce",
      intractionsCount: 69,
      solved: false
    };

    this.posts = [this.postOLD, post2, post3];

    this.posts.push(post2)


  }
}
