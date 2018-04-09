declare var require: any;

import { Http, Headers, HttpModule } from '@angular/http';
import { Follower } from './components/followme';
import { UserTweet } from './components/user';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Component, OnInit } from '@angular/core';
import { FollowService } from './services/followme.service'
import { ScrollEvent } from 'ngx-scroll-event';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { element } from 'protractor';
import { request } from 'https';
const regex = /^[а-яА-ЯёЁa-zA-Z0-9]+$/;

var search;
var page;
let search_param;
const Codebird = require('../../node_modules/codebird');
const $ = require('../../node_modules/jquery');


var cb = new Codebird;
cb.setConsumerKey('9Y7RzNpuPx67eonwf2AW2JzEP', 'LMhjl8xkti2ilYonD4z7MPIjdhbqL4M25x9IqQkrmBacVwnbbJ');
cb.setToken('959577198377295872-m1IWggUyxvSPOuHauOSly3qTBedxu7E', 'N9fXvTWvi1WFR0Odg6YJ0xwIDTHBSwsJ3m07YazsKwN3q');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FollowService]
})

export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('#paragraph') textarea: ElementRef

  ngAfterViewInit() {

  }
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  isAvailable = true;
  searchQuery = '';
  condition: true;
  array: UserTweet[] = [];
  followers = [];
  cb = new Codebird;
  page = 1;
  private loading: boolean = false;
  constructor(private followService: FollowService, private http: Http, private activatedRoute: ActivatedRoute, private location: Location, private router: Router) {
    this.followers = this.followService.getFollowers();
    search = this.searchQuery;

  }

  makecall() {
    $("#leftcol").removeClass("error-msg");
    $("#leftcol").removeClass("no-results");
    $("#leftcol .row").removeClass('hide');
    search = this.searchQuery;
    this.router.navigate(['/search'], {
      queryParams: { q: search },
      relativeTo: this.activatedRoute
    });

    if (!regex.test(search)) {
      $("#leftcol .row").addClass('hide');
      $("#leftcol").addClass("error-msg");
      return;
    }
    if (search == '') {
      $("#leftcol").addClass("enter-search-terms");
      return;
    }
    else {

      $("#leftcol").removeClass("enter-search-terms");

    }
    $("#search").attr('disabled', 'disabled')
    $("#leftcol").addClass("loading");
    let help: UserTweet[] = [];
    cb.__call(
      'search_tweets',
      {
        q: this.searchQuery,
        result_type: 'recent',
        'count': 40,
        'next_page': this.page
      }, function (reply, rate, err) {
        $.each(reply.statuses, function (key, value) {
          help.push(new UserTweet(value.text, value.user.screen_name, value.user.profile_image_url));
        }),

          $("#leftcol").ready(function () { $("#search").removeAttr('disabled') });
        $("#leftcol").ready(function () { $("#leftcol").removeClass('loading') });
        $(window).scroll(function () {
          page = this.page + 1;

          if ($(window).scrollTop() > $(document).height() - $(window).height() - 100) {
            internal(help);

          }

        })
        if (search_param('q') != '' && !(window.location.href.indexOf('user') > -1)) {
          highlight();
        }
        $("#leftcol").ready(function () {
          if (help.length == 0) {
            $("#leftcol").addClass('no-results');

          }
        })
      });

    this.array = help;


  }
  followme(item) {

    item.isFollow = true;
    let follow = this.followService.getFollowers();
    this.followService.addFollower(JSON.stringify(item))
    this.followers = this.followService.getFollowers();
    console.log(this.followService.getFollowers());




  }
  unfollowme(item) {
    if (search_param('user') != '') {
      $('#leftcol button').each(function () { $('#leftcol button').addClass('hide') });
    }
    this.array.forEach(element => {
      if (item.name == element.screen_name) {
        element.isFollow = false;
      }
    });

    this.followService.removeFollower(JSON.stringify(item));
    this.followers = this.followService.getFollowers();
    console.log("in ufollow");
    console.log(this.followService.getFollowers());

  }

  showTimeline(item) {
    $("#leftcol").removeClass('no-results');
    $("#leftcol").css('background', 'white');
    this.router.navigate(['/'], {
      queryParams: { user: item.name },
      relativeTo: this.activatedRoute
    });
    const help = [];

    $("#leftcol").addClass("loading");
    cb.__call(
      'statuses_userTimeline',
      {
        'screen_name': item.name,
        'count': 40,
      },
      function (reply) {
        console.log(reply);
        $.each(reply, function (key, value) { help.push(new UserTweet(value.text, value.user.screen_name, value.user.profile_image_url)) });
        $("#leftcol").ready(function () { $("#leftcol").removeClass('loading') });
        help.forEach(element => {
          element.isFollow = true;
        });
      });

    this.array = help;
    console.log(help);
    return;

  }
  ngOnInit() {
    $("#leftcol").removeClass('no-results');
    this.activatedRoute.params.subscribe((params: Params) => {
      search_param = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

        for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');

          if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
          }
        }
      }
      this.searchQuery = search_param('q');
      if (this.searchQuery != '') {
        this.makecall();
      }

      var user = search_param('user');
      if (user != '') {
        this.followers = this.followService.getFollowers();
        this.followers.forEach(element => {
          if (element.name == user) {
            this.showTimeline(element);
            console.log(element.name);
          }
        });
      }
      console.log(search_param('user'));

    });
  }
}
var highlight = function () {
  $("#leftcol").ready(function () {
    var elems = document.getElementsByClassName('tweet-title');
    var regEx = new RegExp(search, "ig");
    for (var i = 0; i < elems.length; i++) {
      var repl = '<span style="color:red; font-weight:bold; background: yellow; padding:0px">' + search + '</span>';
      elems[i].innerHTML = elems[i].innerHTML.replace(regEx, repl);

    }
    var elems = document.getElementsByClassName('tweet-content');
    var regEx = new RegExp(search, "ig");
    for (var i = 0; i < elems.length; i++) {
      var repl = '<span style="color:red; font-weight:bold; background: yellow; padding:0px">' + search + '</span>';
      elems[i].innerHTML = elems[i].innerHTML.replace(regEx, repl);

    }
  });
}
var internal = function (help) {
  $("#leftcol").addClass("downLoading");
  cb.__call(
    'search_tweets',
    {
      q: search,
      result_type: 'recent',
      'count': 40,
      'next_page': page,
    }, function (reply, rate, err) {
      $.each(reply.statuses, function (key, value) {
        help.push(new UserTweet(value.text, value.user.screen_name, value.user.profile_image_url));


      })

      if (search_param('q') != '' && !(window.location.href.indexOf('user') > -1)) {
        highlight();
      }
    })

  $("#leftcol").ready(function () { $("#leftcol").removeClass('downLoading') });
  $("#leftcol").removeClass('no-results');


}
