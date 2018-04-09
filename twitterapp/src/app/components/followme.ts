export class Follower {
  isFollow: boolean;
  name: string;
  photo: string;

  constructor(name: string, photo: string) {
    this.name = name;
    this.photo = photo;
    this.isFollow=true;
  }
}
