import { link } from "fs";

export class UserTweet { 
   public isFollow: boolean;
    text: string;
    screen_name: string;
    photo: string;
    id:string
    linkMedia:string;
    constructor(text:string, name: string, photo: string, id:string, linkMedia:string) {
        this.text=text;
        this.screen_name = name;
        this.photo = photo;
        this.id=id;
        this.linkMedia=linkMedia
      }
}