import { Component } from '@angular/core';
import { ConnectionService } from '../services/connection.service';
import { ConnectionVo } from 'src/model/connection';
import { OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Chart } from 'chart.js';
import { variable } from '@angular/compiler/src/output/output_ast';
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
  constructor( private connectservice: ConnectionService ) {}

  ngOnInit() {
    this.connectservice.getconnectionservice().subscribe
    (
      (data) => {
        this.connlist = data;
        let data1: any = [];
        data1 = data;
        const totallist: Array<number> = [];
        const idlelist: Array<number> = [];
        const activelist: Array<number> = [];
        data1.forEach((element: ConnectionVo)  => {
          totallist.push(element.total);
          idlelist.push(element.idle);
          activelist.push(element.active);

         });
        this.chart = new Chart('canvas', {
          type: 'bar',
          data: {
          labels: [ 'DEV', 'QA', 'DEMO'],
            datasets: [
               {
                label: 'idle',
                data: idlelist,
                backgroundColor: '#00FFFF' // light blue
              },
              {
                label: 'total',
                data: totallist,
                backgroundColor: '#FF0000' // red
              },
              {
                label: 'active',
                data: activelist,
                backgroundColor: '#00FF00' // green
              }
            ]
          },
          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{ stacked: true }]
            }
  }

         } );
   }
  ); }
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
  refreshfunc(e) {
    this.connectservice.getconnectionservice().subscribe
    (
      (data) => {
        console.log('data is ', data);
        this.connlist = data;
        let data1: any = [];
        data1 = data;
        const totallist: Array<number> = [];
        const idlelist: Array<number> = [];
        const activelist: Array<number> = [];
        data1.forEach((element: ConnectionVo)  => {
          totallist.push(element.total);
          idlelist.push(element.idle);
          activelist.push(element.active);

         });
        this.chart = new Chart('canvas', {
          type: 'bar',
          data: {
            labels: [ 'DEV', 'QA', 'DEMO'],
            datasets: [
              {
               label: 'idle',
               data: idlelist,
               backgroundColor: '#00FFFF' // light blue
             },
             {
               label: 'total',
               data: totallist,
               backgroundColor: '#FF0000' // red
             },
             {
               label: 'active',
               data: activelist,
               backgroundColor: '#00FF00' // green
             }
           ]
         },
          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{ stacked: true }]
            }
  }

         } );
   }
  );
}
}
