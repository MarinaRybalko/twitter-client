declare var require: any;

import { Http, Headers, HttpModule } from '@angular/http';
import { Follower } from './components/followme';
import { UserTweet } from './components/user';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Component, OnInit } from '@angular/core';
import { FollowService } from './services/followme.service'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { element } from 'protractor';
import { request } from 'https';
import { DragDropService } from 'ng2-dnd';
var dragDrop = require('drag-drop')
const regex = /^[а-яА-ЯёЁa-zA-Z0-9\@\_\' '\*\?\<\>\#]+$/;
var simplebox = 'simplebox_util.js';
var search;
var page = 1;
var timeLine = 1;
var current = '';
var userSearch;
let search_param;
const Codebird = require('../../node_modules/codebird');
const $ = require('../../node_modules/jquery');
const JqueryUI = require('../../node_modules/jquery-ui');


var cb = new Codebird;
cb.setConsumerKey('9Y7RzNpuPx67eonwf2AW2JzEP', 'LMhjl8xkti2ilYonD4z7MPIjdhbqL4M25x9IqQkrmBacVwnbbJ');
cb.setToken('959577198377295872-m1IWggUyxvSPOuHauOSly3qTBedxu7E', 'N9fXvTWvi1WFR0Odg6YJ0xwIDTHBSwsJ3m07YazsKwN3q');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../node_modules/ng2-dnd/bundles/style.css'],
  providers: [FollowService, DragDropService]
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
  onSearchPressingEnter(e) {
    $('input').bind('keypress', function (e) {
      if (e.keyCode == 13) {

        this.makecall();

      }
    }.bind(this))
  }
  makecall = function () {
    $(window ).scrollTop(0);
    page=1;
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
        'next_page': page,
        tweet_mode: 'extended'

      }, function (reply, rate, err) {
        $.each(reply.statuses, function (key, value) {
          if (value.retweeted_status != undefined && value.retweeted_status.full_text.indexOf('https://t.co/') != -1) {
            var link_array = value.retweeted_status.full_text.split('https://t.co/');
            var ready_link = 'https://t.co/' + link_array[link_array.length - 1];

            help.push(new UserTweet(value.retweeted_status.full_text, value.user.screen_name, value.user.profile_image_url, value.id, ready_link));
          }
          else {

            help.push(new UserTweet(value.full_text, value.user.screen_name, value.user.profile_image_url, value.id, null));
          }


        }),
          console.log(reply);

        $("#leftcol").ready(function () { $("#search").removeAttr('disabled') });
        $("#leftcol").ready(function () { $("#leftcol").removeClass('loading') });
        if (search_param('q') != '' && !(window.location.href.indexOf('user') > -1)) {
          $(window).scroll(function () {


            if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {

              page = page + 1;
              internal(help)
              $(window).unbind("scroll");

            }

          })

        }

        if (search_param('q') != '' && !(window.location.href.indexOf('user') > -1)) {

          highlight();

        }
        $("#leftcol").ready(function () {
          if (help.length == 0 && search_param('q') != '' && !(window.location.href.indexOf('user') > -1)) {
            $("#leftcol").addClass('no-results');

          }
        })
      }.bind(this));

    this.array = help;


  }
  followme(item) {
    timeLine=1;
   
    item.isFollow = true;
    let follow = this.followService.getFollowers();
    this.followService.addFollower(JSON.stringify(item))
    this.followers = this.followService.getFollowers();
    console.log(this.followService.getFollowers());

  }
  unfollowme(item) {
    if (search_param('user') != ' ' && search_param('q') == ' ') {
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
  isHasLink(item): boolean {
    if (item.linkMedia != null) {
      return false;
    }
    else {
      return true;
    }
  }
  showTimeline=function(item) {
    $(window ).scrollTop(0);
   
      
  alert("in timelimne"+timeLine)

    $("#leftcol").addClass("loading");
   
    this.router.navigate(['/'], {
      queryParams: { user: item.name },
      relativeTo: this.activatedRoute
    });
    const help = [];

    cb.__call(
      'statuses_userTimeline',
      {
        'screen_name': item.name,
        'count': 40,
        'next_page': timeLine,
        tweet_mode: 'extended'
      },
      function (reply) {
        console.log(reply);
        $.each(reply, function (key, value) {

          if (value.retweeted_status != undefined && value.retweeted_status.full_text.indexOf('https://t.co/') != -1) {
            var link_array = value.retweeted_status.full_text.split('https://t.co/');
            var ready_link = 'https://t.co/' + link_array[link_array.length - 1];
            console.log(ready_link);

            help.push(new UserTweet(value.retweeted_status.full_text, value.user.screen_name, value.user.profile_image_url, value.id, ready_link));
          }
          else help.push(new UserTweet(value.full_text, value.user.screen_name, value.user.profile_image_url, value.id, null));

        });

        $("#leftcol").ready(function () { $("#leftcol").removeClass('loading') });
        help.forEach(element => {
          element.isFollow = true;
        });
        console.log(help)
      });
    if (search_param('user') != '' && !(window.location.href.indexOf('q') > -1)) {
      
      $(window).scroll(function () {
      

        if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {

          if(timeLine !=1)
          $("#leftcol").ready(function () { $("#leftcol").removeClass('down-loading') });
          timeLine = timeLine + 1;
          alert("in timelimne"+timeLine)
          TimelineInternal(help, item.name);

        }
      })
    }
    this.array = help;
    console.log(help);
    return;
  }
  ClosePicture() {
    $("table").ready(function () { $('button').each(function () { $("button").removeAttr('disabled') }) });
    $('div>a').removeClass('disabled');
    $('.js-overlay-campaign').fadeOut();
    $('table').css('filter', 'none');
    $('#overlay img ').remove();
  }
  CloseByMousePressing(e) {
    $("table").ready(function () { $('button').each(function () { $("button").removeAttr('disabled') }) });
    $('div>a').removeClass('disabled');
    var popup = $('.js-overlay-campaign');
    if (e.target != popup[0] && popup.has(e.target).length === 0) {
      $('.js-overlay-campaign').fadeOut();
      $('table').css('filter', 'none');
    }
  }
  viewPicture(item) {


    var fullimg = item.photo.replace('_normal', '');
    console.log(item.name);

    $('div>a').addClass('disabled');
    $("table").ready(function () { $('button').each(function () { $("button").attr('disabled', 'disabled') }) });
    //$('.js-overlay-campaign').ready(   $('.js-overlay-campaign').html('<div class="close-popup js-close-campaign" ></div>'));
    console.log(item);
    var userSearch = item.screen_name;

    $('#overlay img').addClass('class-img');
    $('#overlay').append('<img  style="overflow: hidden;width: 100%; height: 80%; vertical-align: middle;" src= "' + fullimg + '"</img>');

    $('table').css('filter', 'blur(3px)');
    $('.js-overlay-campaign').fadeIn();

    console.log("heeee" + item.photo);



  }
  showFullTweet(ready_string) {
    if (ready_string != null)
      window.open(ready_string, "yyyyy", "width=480,height=360,resizable=no,toolbar=no,menubar=no,location=no,status=no");
  }
  saveCurrentItem(item) {
    current = item.id;
    console.log(current);
  }
  addFollowersByDrag() {
    this.array.forEach(element => {
      if (element.id == current && !element.isFollow) {
        element.isFollow = true;
        let follow = this.followService.getFollowers();
        this.followService.addFollower(JSON.stringify(element))
        this.followers = this.followService.getFollowers();
        console.log(this.followService.getFollowers());
        return;

      }

    });


  }

  ngOnInit() {
 page=1;
 timeLine=0;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.searchQuery = search_param('q');
      this.searchQuery = search_param('q');
      if ( search_param('q')!= '') {
        if(this.searchQuery==undefined)
        return;
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
      if (elems[i].innerHTML.indexOf('<span style="color:red; font-weight:bold; background: yellow; padding:0px">') == -1)
        elems[i].innerHTML = elems[i].innerHTML.replace(regEx, repl);

    }
    var elems = document.getElementsByClassName('tweet-content');
    var regEx = new RegExp(search, "ig");
    for (var i = 0; i < elems.length; i++) {
      var repl = '<span style="color:red; font-weight:bold; background: yellow; padding:0px">' + search + '</span>';
      if (elems[i].innerHTML.indexOf('<span style="color:red; font-weight:bold; background: yellow; padding:0px">') == -1)
        elems[i].innerHTML = elems[i].innerHTML.replace(regEx, repl);

    }
  });
}
var internal = function (help) {
  console.log(page)
  $("#downloading").addClass("down-loading");
  cb.__call(
    'search_tweets',
    {
      q: search,
      result_type: 'recent',
      'count': 40,
      'next_page': page,
      tweet_mode: 'extended'
    }, function (reply, rate, err) {

      $.each(reply.statuses, function (key, value) {

        if (value.retweeted_status != undefined && value.retweeted_status.full_text.indexOf('https://t.co/') != -1) {
          var link_array = value.retweeted_status.full_text.split('https://t.co/');
          var ready_link = 'https://t.co/' + link_array[link_array.length - 1];
          console.log(ready_link);

          help.push(new UserTweet(value.retweeted_status.full_text, value.user.screen_name, value.user.profile_image_url, value.id, ready_link));
        }
        else help.push(new UserTweet(value.full_text, value.user.screen_name, value.user.profile_image_url, value.id, null));
        $("#downloading").ready(function () { $("#downloading").removeClass('down-loading') });
      })
     
      if (search_param('q') != '' && !(window.location.href.indexOf('user') > -1)) {

        highlight();
        $(window).scroll(function () {


          if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {
            page = page + 1;
            internal(help);

            $(window).unbind("scroll");
          }

        })
      }
    })




}
search_param = function (sParam) {
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
var TimelineInternal = function (help, name) {
  console.log(page)
  alert("in timelimne"+timeLine)
  timeLine = timeLine + 1;
  $("#downloading").addClass("down-loading");
  cb.__call(
    'statuses_userTimeline',
    {
      'screen_name': name,
      'count': 40,
      'next_page': timeLine,
      tweet_mode: 'extended'
    },
    function (reply) {
      console.log(reply);
      $.each(reply, function (key, value) {
        if (value.retweeted_status != undefined && value.retweeted_status.full_text.indexOf('https://t.co/') != -1) {
          var link_array = value.retweeted_status.full_text.split('https://t.co/');
          var ready_link = 'https://t.co/' + link_array[link_array.length - 1];
          console.log(ready_link);

          help.push(new UserTweet(value.retweeted_status.full_text, value.user.screen_name, value.user.profile_image_url, value.id, ready_link));
        }
        else help.push(new UserTweet(value.full_text, value.user.screen_name, value.user.profile_image_url, value.id, null));
      });


      help.forEach(element => {
        element.isFollow = true;
      });

      $("#downloading").ready(function () { $("#downloading").removeClass('down-loading') });
    });

  if (search_param('user') != '' && !(window.location.href.indexOf('q') > -1)) {

    $(window).scroll(function () {

      if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {

        
        alert("in timelimne"+timeLine)
        console.log(this.array);
        TimelineInternal(help, name)


      }

    })

  }

}