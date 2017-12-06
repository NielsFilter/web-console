import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "app-management-page",
  templateUrl: "./management-page.component.html",
  styleUrls: ["./management-page.component.css"]
})
export class ManagementPageComponent implements OnInit {
  platformGroups: any[] = [
    {
      Id: 2,
      Name: "Group1",
      GroupType: 2,
      ParentId: 4,
      GroupKey: "group1",
      children: [
        {
          Id: 4,
          Name: "Group3",
          GroupType: 2,
          ParentId: 5,
          GroupKey: "group1"
        },
        {
          Id: 3,
          Name: "Group2",
          GroupType: 2,
          ParentId: 1,
          GroupKey: "group2"
        }
      ]
    },
    {
      Id: 4,
      Name: "Group3",
      GroupType: 2,
      ParentId: 5,
      GroupKey: "group1"
    },
    {
      Id: 3,
      Name: "Group2",
      GroupType: 2,
      ParentId: 1,
      GroupKey: "group2"
    },
    {
      Id: 5,
      Name: "Collection 1",
      GroupType: 1,
      ParentId: 1,
      GroupKey: null
    }
  ];

  // platformGroups: any[] = [];

  constructor() {
    // this.nestGroups(this.mockplatformGroups);
  }

  nestGroups(groups: any): void {
    const sortedGroups = _.sortBy(groups, "Id");
    const nestedStructure: any[] = [];

    for (const item of sortedGroups) {
      item["children"] = [];

      const childItems = sortedGroups.filter(
        filteredItem => filteredItem.ParentId === item.Id
      );
      for (const childItem of childItems) {
        item["children"].push(childItem);
      }
    }

    console.log(sortedGroups);
  }

  ngOnInit() {}
}
