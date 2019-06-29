import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})

export class SummaryComponent implements OnInit {
  objectvalues = Object.values;
  LineChart: [];
  teams: any[] = [];
  matches = {};
  chartDetails: any;

  constructor() { }

  ngOnInit() {
    this.getTeams();
    this.getMatches();
    setTimeout(() => {
      this.createChart();
    }, 1000);
  }

  createChart() {
    this.chartDetails = this.arrangeChartData();
    let newDataSets = [];
    if (this.chartDetails) {
      Object.values(this.chartDetails).forEach((team) => {
        let teamInfo = {};
        teamInfo['label'] = team['code'];
        teamInfo['data'] = [];
        let bubble = {
          x: team['won'],
          y: team['lost'],
          r: team['goalFor']
        }
        teamInfo['data'].push(bubble)
        teamInfo['backgroundColor'] = this.getRandomColor();

        newDataSets.push(teamInfo);
      })
    }

    let options = {
      type: 'bubble',
      data: {
        datasets: newDataSets
      }
    }

    this.LineChart = new Chart('myChart', options);
  }

  getTeams() {
    let url = "https://raw.githubusercontent.com/ajbitus/interview-tasks/master/epl-2011-12/teams.json";
    return fetch(url)
      .then(resp => resp.json())
      .then(teams => this.teams = teams.clubs)
      .catch(e => console.error(e));
  }

  getMatches() {
    let url = "https://raw.githubusercontent.com/ajbitus/interview-tasks/master/epl-2011-12/matches.json";
    fetch(url)
      .then(resp => resp.json())
      .then(matches => this.matches = matches)
      .catch(e => console.error(e));
  }

  arrangeChartData() {
    let teamObj = {};
    // console.log(this.matches['rounds'].length);

    this.matches['rounds'].forEach((round) => {
      round['matches'].forEach((match) => {
        let team1Code = match['team1']['code'];
        let team2Code = match['team2']['code'];

        if (!teamObj[team1Code]) {
          teamObj[team1Code] = {}
          // console.log(team1Code);
          teamObj[team1Code]["code"] = team1Code;
          teamObj[team1Code]["total"] = 0;
          teamObj[team1Code]["won"] = 0;
          teamObj[team1Code]["lost"] = 0;
          teamObj[team1Code]["tie"] = 0;
          teamObj[team1Code]["goalFor"] = 0;
          teamObj[team1Code]["goalAgainst"] = 0;
        }
        if (!teamObj[team2Code]) {
          teamObj[team2Code] = {}
          teamObj[team2Code]["code"] = team2Code;
          teamObj[team2Code]["total"] = 0;
          teamObj[team2Code]["won"] = 0;
          teamObj[team2Code]["lost"] = 0;
          teamObj[team2Code]["tie"] = 0;
          teamObj[team2Code]["goalFor"] = 0;
          teamObj[team2Code]["goalAgainst"] = 0;
        }

        if (match.score1 > match.score2) {
          teamObj[team1Code]["won"] += 1;
          teamObj[team2Code]["lost"] += 1;

        } else if (match.score1 < match.score2) {
          teamObj[team1Code]["lost"] += 1;
          teamObj[team2Code]["won"] += 1;
        } else {
          teamObj[team1Code]["tie"] += 1;
          teamObj[team2Code]["tie"] += 1;
        }

        teamObj[team1Code]["total"] += 1;
        teamObj[team2Code]["total"] += 1;

        teamObj[team1Code]["goalFor"] += match.score1;
        teamObj[team1Code]["goalAgainst"] += match.score2;
        teamObj[team2Code]["goalAgainst"] += match.score1;
        teamObj[team2Code]["goalFor"] += match.score2;
      });
    })

    return teamObj;

  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
