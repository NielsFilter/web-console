import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.css']
})

export class ManagementPageComponent implements OnInit {
  platformGroups = [
    {
      Id: 2, Name: 'Group1', GroupType: 2, 'ParentId': 1, GroupKey: 'group1'
    }, {
      Id: 3, Name: 'Group2', GroupType: 2, 'ParentId': 1, GroupKey: 'group2'
    },{
      Id: 4, Name: 'Group3', GroupType: 2, 'ParentId': 1, GroupKey: 'group1'
    }, {
      Id: 5, Name: 'Collection 1', GroupType: 1, 'ParentId': 1, GroupKey: null
    }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}


