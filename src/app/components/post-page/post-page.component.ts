import { Component } from '@angular/core';
import { Post } from '../../domains';
import { PostComponent } from "../post/post.component";

@Component({
  selector: 'app-post-page',
  imports: [PostComponent],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})

export class PostPageComponent {

  posts?: Post[];

  constructor() {
    this.posts = [
      {
        id: "123",
        createdBy: "Martinko",
        createAt: new Date(Date.now()).toLocaleString(),
        petName: "LEO",
        location: "Dunajska Streda",
        photos: ["https://media.tenor.com/lwumhdMpAVkAAAAe/a.png"],
        intractionsCount: 67,
        solved: true
      },
      {
        id: "4",
        createdBy: "Jozu kubani",
        createAt: new Date(1734977093).toLocaleString(),
        petName: "Marta",
        location: "Brunovce",
        photos: ["https://images.ctfassets.net/ub3bwfd53mwy/5WFv6lEUb1e6kWeP06CLXr/acd328417f24786af98b1750d90813de/4_Image.jpg?w=750"],
        intractionsCount: 69,
        solved: false
      },
      {
        id: "5",
        createdBy: "Jozu kubani",
        createAt: new Date(1734977093).toLocaleString(),
        petName: "Marta",
        location: "Brunovce",
        photos: ["https://dogwoodanimalhospital.com/wp-content/uploads/2025/07/img-cute-cat-breeds-you-probably-never-heard-of.webp"],
        intractionsCount: 69,
        solved: false
      }
    ];
  }
}
