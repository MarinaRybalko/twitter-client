export class Follower {
  isFollow: boolean;
  id:string;
  name: string;
  photo: string;

  constructor(name: string, photo: string, id: string) {
    this.name = name;
    this.photo = photo;
    this.isFollow=true;
    this.id=id;
  }
}
