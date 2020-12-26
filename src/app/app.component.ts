import { Component } from '@angular/core';
import { ConnectionService } from '../services/connection.service';
import { ConnectionVo } from 'src/model/connection';
import { OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Chart } from 'chart.js';
import { variable } from '@angular/compiler/src/output/output_ast';
import { tempResult } from '../model/tempResult';
import { month } from '../model/month';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  connobjqa: ConnectionVo;
  connobjdev: ConnectionVo;
  connobjdemo: ConnectionVo;
  connlist: ConnectionVo[];
  connecttypeqa = 'qa';
  connecttypedev = 'dev';
  connecttypedemo = 'demo';
  chart: [];
  chart2: [];
  chart3: [];
  startDate: any;
  endDate: any;
  userStartDate: any;
  userEndDate: any;
  errDates: boolean = false;
  fromDateError: boolean = false;
  toDateError: boolean = false;

  devTotalList: Array<number> = [];
  devIdleList: Array<number> = [];
  devActiveList: Array<number> = [];
  devTimeLabels: Array<string> = [];
  devGraphLength: number;

  qaTotalList: Array<number> = [];
  qaIdleList: Array<number> = [];
  qaActiveList: Array<number> = [];
  qaTimeLabels: Array<string> = [];
  qaGraphLength: number;

  demoTotalList: Array<number> = [];
  demoIdleList: Array<number> = [];
  demoActiveList: Array<number> = [];
  demoTimeLabels: Array<string> = [];
  demoGraphLength: number;

  totalConnectionsList: any[];
  timeLine = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    connectionserver: new FormControl('')
  });

  constructor( private connectservice: ConnectionService ) {}

  ngOnInit() {
    this.refreshfunc();
  }

  qafunc(e) {
    this.connectservice.connectionservice(this.connecttypeqa).subscribe
    (
      (data: ConnectionVo) => {
        this.connobjqa = data;
      }
    );
  }

  devfunc(e) {
    this.connectservice.connectionservice(this.connecttypedev).subscribe
    (
      (data: ConnectionVo) => {
        this.connobjdev = data;
      }
    );
  }

  demofunc(e) {
    this.connectservice.connectionservice(this.connecttypedemo).subscribe
    (
      (data: ConnectionVo) => {
        this.connobjdemo = data;
      }
    );
  }

  filterfunc() {
    this.errDates = this.timeLine.value.fromDate > this.timeLine.value.toDate ? true : false;
    this.fromDateError = this.timeLine.value.fromDate < this.startDate ? true : false;
    this.toDateError = this.timeLine.value.toDate > this.endDate ? true : false;
    if(this.errDates || this.fromDateError || this.toDateError){
      return;
    }
    this.updateConnectionsList(this.totalConnectionsList, this.timeLine.value.fromDate, this.timeLine.value.toDate, this.timeLine.value.connectionserver);
  }

  updateDevConnectionsList(totalConnList, date1, date2){
    this.devActiveList = [];
    this.devIdleList = [];
    this.devTotalList = [];
    this.devTimeLabels = [];
    var currDev = 0;

    if(date1 === date2){
      totalConnList.forEach((element) => {
        if(element.connectionserver === 'DEV'){
          var exp = Date.parse(element.time);
          var newExpDate = new Date(exp);
          var temp = `${newExpDate.getFullYear()}-${newExpDate.getMonth()+1}-${newExpDate.getDate()}`;

          if(date1 === temp){
            this.devTotalList.push(element.total);
            this.devIdleList.push(element.idle);
            this.devActiveList.push(element.active);
            var timeLabel = element.time.substring(11,16);
            var dateLabel = `${month[newExpDate.getMonth()]} ${newExpDate.getDate()}`;
            this.devTimeLabels.length ? this.devTimeLabels.push(timeLabel) : this.devTimeLabels.push(dateLabel) ;
          }
        }
      });
    } else {
      totalConnList.forEach((element) => {
        if(element.connectionserver === 'DEV'){
          var exp = Date.parse(element.time);
          var newExpDate = new Date(exp);
          var temp = `${newExpDate.getFullYear()}-${newExpDate.getMonth()+1}-${newExpDate.getDate()}`;

          if(date1 <= temp && temp <= date2){
            this.devTotalList.push(element.total);
            this.devIdleList.push(element.idle);
            this.devActiveList.push(element.active);

            var timeLabel = element.time.substring(11,16);
            var dateLabel = `${month[newExpDate.getMonth()]} ${newExpDate.getDate()}`;

            if(this.devTimeLabels.length) {
              if(this.devTimeLabels[currDev-1] === dateLabel){
                this.devTimeLabels.push(timeLabel);
              }
              else{
                this.devTimeLabels.push(dateLabel);
                currDev = this.devTimeLabels.length;
              }
            } else {
              this.devTimeLabels.push(dateLabel)
              currDev++;
            }
          }
        }
      });
    }
    this.devGraphLength = this.devTimeLabels.length*25;
    console.log(this.devGraphLength, 'this dev graph length');
    if(this.chart) (<Chart>this.chart).destroy();
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels : this.devTimeLabels,
        datasets : [
          {
            label: 'Dev Idle',
            data: this.devIdleList,
            borderColor: "#3e95cd",
            fill: false
          },
          {
            label: 'Dev Active',
            data: this.devActiveList,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            label: 'Dev Total',
            data: this.devTotalList,
            borderColor: "#c45850",
            fill: false
          }
        ]
      },
      options: {
        legend: {
          labels: {
            fontSize: 16
          }
        }
      }
    });
  }

  updateQAConnectionsList(totalConnList, date1, date2){
    this.qaActiveList = [];
    this.qaIdleList = [];
    this.qaTotalList = [];
    this.qaTimeLabels = [];
    var currQA = 0;

    if(date1 === date2){
      totalConnList.forEach((element) => {
        if(element.connectionserver === 'QA'){
          var exp = Date.parse(element.time);
          var newExpDate = new Date(exp);
          var temp = `${newExpDate.getFullYear()}-${newExpDate.getMonth()+1}-${newExpDate.getDate()}`;

          if(date1 === temp){
            this.qaTotalList.push(element.total);
            this.qaIdleList.push(element.idle);
            this.qaActiveList.push(element.active);
            var timeLabel = element.time.substring(11,16);
            var dateLabel = `${month[newExpDate.getMonth()]} ${newExpDate.getDate()}`;
            this.qaTimeLabels.length ? this.qaTimeLabels.push(timeLabel) : this.qaTimeLabels.push(dateLabel);
          }
        }
      });
    } else {
      totalConnList.forEach((element) => {
        if(element.connectionserver === 'QA'){
          var exp = Date.parse(element.time);
          var newExpDate = new Date(exp);
          var temp = `${newExpDate.getFullYear()}-${newExpDate.getMonth()+1}-${newExpDate.getDate()}`;

          if(date1 <= temp && temp <= date2){
            this.qaTotalList.push(element.total);
            this.qaIdleList.push(element.idle);
            this.qaActiveList.push(element.active);

            var exp = Date.parse(element.time);
            var newExpDate = new Date(exp);
            var timeLabel = element.time.substring(11,16);
            var dateLabel = `${month[newExpDate.getMonth()]} ${newExpDate.getDate()}`;

            if(this.qaTimeLabels.length) {
              if(this.qaTimeLabels[currQA-1] === dateLabel){
                this.qaTimeLabels.push(timeLabel);
              }
              else{
                this.qaTimeLabels.push(dateLabel);
                currQA = this.qaTimeLabels.length;
              }
            } else {
              this.qaTimeLabels.push(dateLabel)
              currQA++;
            }
          }
        }
      });
    }
    this.qaGraphLength = this.qaTimeLabels.length*25;
    if(this.chart2) (<Chart>this.chart2).destroy();
    this.chart2 = new Chart('canvas2', {
      type: 'line',
      data: {
        labels : this.qaTimeLabels,
        datasets : [
          {
            label: 'QA Idle',
            data: this.qaIdleList,
            borderColor: "#3e95cd",
            fill: false
          },
          {
            label: 'QA Active',
            data: this.qaActiveList,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            label: 'QA Total',
            data: this.qaTotalList,
            borderColor: "#c45850",
            fill: false
          }
        ]
      },
      options: {
        legend: {
          labels: {
            fontSize: 16
          }
        }
      }
    });
  }

  updateDemoConnectionsList(totalConnList, date1, date2){
    this.demoActiveList = [];
    this.demoIdleList = [];
    this.demoTotalList = [];
    this.demoTimeLabels = [];
    var currDemo = 0;

    if(date1 === date2){
      totalConnList.forEach((element) => {
        if(element.connectionserver === 'DEMO'){
          var exp = Date.parse(element.time);
          var newExpDate = new Date(exp);
          var temp = `${newExpDate.getFullYear()}-${newExpDate.getMonth()+1}-${newExpDate.getDate()}`;

          if(date1 === temp){
            this.demoTotalList.push(element.total);
            this.demoIdleList.push(element.idle);
            this.demoActiveList.push(element.active);
            var timeLabel = element.time.substring(11,16);
            var dateLabel = `${month[newExpDate.getMonth()]} ${newExpDate.getDate()}`;
            this.demoTimeLabels.length ? this.demoTimeLabels.push(timeLabel) : this.demoTimeLabels.push(dateLabel);
          }
        }
      });
    } else {
      totalConnList.forEach((element) => {
        if(element.connectionserver === 'DEMO'){
          var exp = Date.parse(element.time);
          var newExpDate = new Date(exp);
          var temp = `${newExpDate.getFullYear()}-${newExpDate.getMonth()+1}-${newExpDate.getDate()}`;

          if(date1 <= temp && temp <= date2){
            this.demoTotalList.push(element.total);
            this.demoIdleList.push(element.idle);
            this.demoActiveList.push(element.active);


            var timeLabel = element.time.substring(11,16);
            var dateLabel = `${month[newExpDate.getMonth()]} ${newExpDate.getDate()}`;

            if(this.demoTimeLabels.length) {
              if(this.demoTimeLabels[currDemo-1] === dateLabel){
                this.demoTimeLabels.push(timeLabel);
              }
              else{
                this.demoTimeLabels.push(dateLabel);
                currDemo = this.demoTimeLabels.length;
              }
            } else {
              this.demoTimeLabels.push(dateLabel)
              currDemo++;
            }
          }
        }
      });
    }

    this.demoGraphLength = this.demoTimeLabels.length*25;
    if(this.chart3) (<Chart>this.chart3).destroy();
    this.chart3 = new Chart('canvas3', {
      type: 'line',
      data: {
        labels : this.demoTimeLabels,
        datasets : [
          {
            label: 'Demo Idle',
            data: this.demoIdleList,
            borderColor: "#3e95cd",
            fill: false
          },
          {
            label: 'Demo Active',
            data: this.demoActiveList,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            label: 'Demo Total',
            data: this.demoTotalList,
            borderColor: "#c45850",
            fill: false
          }
        ]
      },
      options: {
        legend: {
          labels: {
            fontSize: 16
          }
        }
      }
    });
  }

  updateConnectionsList(totalConnList, date1, date2, conser){
    switch(conser){
      case 'DEV':
        this.updateDevConnectionsList(totalConnList, date1, date2);
        break;

      case 'QA':
        this.updateQAConnectionsList(totalConnList, date1, date2);
        break;

      case 'DEMO':
        this.updateDemoConnectionsList(totalConnList, date1, date2);
        break;

      case 'ALL':
        this.updateDevConnectionsList(totalConnList, date1, date2);
        this.updateQAConnectionsList(totalConnList, date1, date2);
        this.updateDemoConnectionsList(totalConnList, date1, date2);
        break;
    }
  }

  refreshfunc() {
      // this.connectservice.getConnectionHistory().subscribe(res => {
      //   const result = [];
      //   for(var i in res){
      //     result.push(res[i]);
      //   }
        this.errDates = false;
        this.fromDateError = false;
        this.toDateError = false;
        this.totalConnectionsList = tempResult;
        var s = new Date(Date.parse(tempResult[0].time));
        var e = new Date(Date.parse(tempResult[tempResult.length-1].time));
        var cs = 'ALL';

        this.userStartDate = `${s.getDate()}-${s.getMonth()+1}-${s.getFullYear()}`;
        this.userEndDate = `${e.getDate()}-${e.getMonth()+1}-${e.getFullYear()}`;
        this.startDate = `${s.getFullYear()}-${s.getMonth()+1}-${s.getDate()}`;
        this.endDate = `${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`;

        this.updateConnectionsList(this.totalConnectionsList, this.startDate, this.endDate, cs);
    // });
  }
}
