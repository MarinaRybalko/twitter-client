export class UserTweet { 
   public isFollow: boolean;
    text: string;
    screen_name: string;
    photo: string;
    constructor(text:string, name: string, photo: string) {
        this.text=text;
        this.screen_name = name;
        this.photo = photo;
      }
}