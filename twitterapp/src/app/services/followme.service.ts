declare var require: any;
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Follower } from '../components/followme';
const $ = require('../../../node_modules/jquery');


@Injectable()
export class FollowService {

  constructor() {
    const followers = this.getFollowers();
  }

  public addFollower(user: string): void {
    console.log(user);
    const newuser = JSON.parse(user);
    console.log("Hewuser" + newuser);

    const follower = new Follower(newuser.screen_name, newuser.photo);

    const users = this.getFollowers();
    users.push(follower);


    this.setLocalStorageFollowers(users);
  }

  public getFollowers(): Follower[] {
    const localStorageItem = JSON.parse(localStorage.getItem('followers'));
    return localStorageItem == null ? [] : localStorageItem.followers;
  }

  public removeFollower(user: string): void {
    console.log(user);
    var newuser = JSON.parse(user);

    let followers = this.getFollowers();
    console.log(followers);
    followers = followers.filter((follower) => follower.name != newuser.name);
    this.setLocalStorageFollowers(followers);
  }
  private setLocalStorageFollowers(followers: Follower[]): void {
    localStorage.setItem('followers', JSON.stringify({ followers: followers }));
  }

}
