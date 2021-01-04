import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import { ConnectionService } from '../../services/connection.service';
import { tempResult2 } from '../../model/tempResult2';
Drilldown(Highcharts);

@Component({
  selector: 'app-drill-down',
  templateUrl: './drill-down.component.html',
  styleUrls: ['./drill-down.component.css']
})
export class DrillDownComponent implements OnInit {
    devIdleCount = 0;
    qaIdleCount = 0;
    demoIdleCount = 0;

    devIpAddressList = [];
    qaIpAddressList = [];
    demoIpAddressList = [];

    devSeriesList = [];
    qaSeriesList = [];
    demoSeriesList = [];

    fixedList = [];
    expList = [];
    combinedArr = [];
    loading: boolean = true;
    loader: boolean = true;


  constructor( private connectservice: ConnectionService ) { }

  ngOnInit(){
    this.loading = true;
    this.refreshfunc();
  }

  refreshfunc(){
    this.loader = true;
    // this.connectservice.getDrillDownData().subscribe( res => {
        this.loader = false;
    //     console.log(res, 'res');
        this.devIdleCount = 0;
        this.qaIdleCount = 0;
        this.demoIdleCount = 0;

        this.devIpAddressList = [];
        this.qaIpAddressList = [];
        this.demoIpAddressList = [];

        this.devSeriesList = [];
        this.qaSeriesList = [];
        this.demoSeriesList = [];
        this.loading = false;
        // const result = [];

        // for(var i in res){
        //     result.push(res[i]);
        // }
        tempResult2.forEach((ele,index)=> {
            var id = ele.connectionServer + (index+1).toString();
            var temp = {name: ele.ipAddress, y: ele.idle, drilldown: id}

            if(ele.connectionServer === 'DEV'){
                this.devIdleCount = this.devIdleCount + ele.idle;
                this.devIpAddressList.push(temp);
                for(var i=0; i<ele.idleList.length; i++){
                    var name = ele.idleList[i].application_name ? ele.idleList[i].application_name : 'Empty';
                    var temp2 = {name: name, y: ele.idleList[i].count};
                    this.devSeriesList.push(temp2);
                }
                var temp3 = { id: id, type: 'column', data: this.devSeriesList};
                this.expList.push(temp3);
                this.devSeriesList = [];
            }

            else if(ele.connectionServer === 'QA') {
                this.qaIdleCount = this.qaIdleCount + ele.idle;
                this.qaIpAddressList.push(temp);
                for(var i=0; i<ele.idleList.length; i++){
                    var name = ele.idleList[i].application_name ? ele.idleList[i].application_name : 'Empty';
                    var temp2 = {name: name, y: ele.idleList[i].count};
                    this.qaSeriesList.push(temp2);
                }
                var temp3 = { id: id, type: 'column', data: this.qaSeriesList};
                this.expList.push(temp3);
                this.qaSeriesList = [];
            }

            else if(ele.connectionServer === 'DEMO') {
                this.demoIdleCount = this.demoIdleCount + ele.idle;
                this.demoIpAddressList.push(temp);
                for(var i=0; i<ele.idleList.length; i++){
                    var name = ele.idleList[i].application_name ? ele.idleList[i].application_name : 'Empty';
                    var temp2 = {name: name, y: ele.idleList[i].count};
                    this.demoSeriesList.push(temp2);
                }
                var temp3 = { id: id, type: 'column', data: this.demoSeriesList};
                this.expList.push(temp3);
                this.demoSeriesList = [];
            }
        });

        this.fixedList = [{
            id: 'devIpList',
            type: 'column',
            data: this.devIpAddressList
        }, {
            id: 'qaIpList',
            type: 'column',
            data: this.qaIpAddressList
        }, {
            id: 'demoIpList',
            type: 'column',
            data: this.demoIpAddressList
        }];

        this.combinedArr = [...this.fixedList, ...this.expList];

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Idle Connections'
            },
            xAxis: {
                type: 'category'
            },

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },

            series: [{
                name: 'Connections',
                type: 'column',
                colorByPoint: true,
                data: [{
                    name: 'Dev',
                    y: this.devIdleCount,
                    drilldown: 'devIpList'
                }, {
                    name: 'QA',
                    y: this.qaIdleCount,
                    drilldown: 'qaIpList',
                    color: 'rgb(212, 84, 84)'
                }, {
                    name: 'Demo',
                    y: this.demoIdleCount,
                    drilldown: 'demoIpList'
                }]
            }],
            drilldown: {
                series: this.combinedArr
            }
        });
    // });
  }
}