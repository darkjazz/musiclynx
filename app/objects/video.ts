export class Thumbnail {
  url: string;
  width: string;
  height: string;
}

export class Video {
  id: string;
  link: string;
  title: string;
  width: string;
  height: string;
  high: Thumbnail;
  thumbnail: Thumbnail;
}
