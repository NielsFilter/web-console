import { Component, OnInit, Input, Output } from '@angular/core';
import { AccountListComponent } from '../account-list/account-list.component';
import { DataService } from '../../services/data.service';
import { LoggerService } from '../../services/logger.service';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  CONTEXT = 'Tree Component';

  accordionGroup = "accordion-group-" + Math.floor((Math.random() * 100000000) + 1).toString();


  dataParent = this.accordionGroup;
  dataParentId = `#${this.dataParent}`;

  @Input() treeData: any;
  accounts: any;
  accountsLoading = false;

  constructor(private logger: LoggerService, private dataService: DataService) { }


  ngOnInit() {
  //   $('.panel-heading a').click(function() {
  //     $('.panel-heading').removeClass('active');
  //     //If the panel was open and would be closed by this click, do not active it
  //     if(!$(this).closest('.panel').find('.panel-collapse').hasClass('in'))
  //         $(this).parents('.panel-heading').addClass('active');
  //  });
  }

  getRandomId(): string {
    return "random-id-" + Math.floor((Math.random() * 100000000) + 1).toString();
  }

  addGroupButtonClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `addGroupButtonClicked() was called for ${id}(${name})`);
  }

  removeGroupButtonClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `removeGroupButtonClicked() was called for ${id}(${name})`);
  }

  groupSettingsButtonClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `groupSettingsButtonClicked() was called for ${id}(${name})`);
  }

  adminGroupClicked(name: string, id: number, event: Event) {
    const htmlElement = this.getEventElementId(event);

      // checks if the 'show' class is added. if it is, the group is being closed and should not send an unnecessary http request
      if(htmlElement.classList.contains('show')){
        htmlElement.parentElement.firstElementChild.classList.remove('custom-active');
        this.logger.TRACE(this.CONTEXT, 'Closing Collection');
        return;
      }
      this.activeClass();
      htmlElement.parentElement.firstElementChild.classList.add('custom-active');

      // TODO some caching and http request to update groups?
  }



  getBackupAccountsForGroup(name: string, id: number, event: Event) {
    const htmlElement = this.getEventElementId(event);

    // checks if the 'show' class is added. if it is, the group is being closed and should not send an unnecessary http request
    if(htmlElement.classList.contains('show')){
      htmlElement.parentElement.firstElementChild.classList.remove('custom-active');

      this.logger.TRACE(this.CONTEXT, 'Closing group');
      return;
    }
    this.activeClass();
    htmlElement.parentElement.firstElementChild.classList.add('custom-active');


    this.logger.TRACE(this.CONTEXT, `User queried group with id ${id}(${name}) for backup accounts`);
    this.accountsLoading = true;

    this.dataService.getAccountsForGroup(id)
      .then(response => {
        this.logger.DEBUG(this.CONTEXT, 'tree.fetching.accounts.successful');
        // @ts-ignore: this has some data under the res
        this.accounts = response.data;
        // this.accounts = response; // for building purposes
      })
      .catch(ex => {
        this.logger.ERROR(this.CONTEXT, 'tree.fetching.accounts.unsuccessful');
      })
      .then(() => {
        this.accountsLoading = false;
      });
  }


  getEventElementId(event: Event): HTMLElement{
    const target = event.target || event.srcElement || event.currentTarget;
    const targetString = target.toString();

    const n = targetString.lastIndexOf('/#');
    const groupAssignedId = targetString.substring(n + 2);

    const e = document.getElementById(groupAssignedId);
    this.logger.TRACE(this.CONTEXT, `Found element id ${groupAssignedId}`);
    this.logger.TRACE(this.CONTEXT, 'Attributes : \n\n' + JSON.stringify(document.getElementById(groupAssignedId).attributes));
    this.logger.TRACE(this.CONTEXT, 'Classes : \n\n' + JSON.stringify(e.classList));
    return e;
  }


  activeClass() {
    // var expanded_elements = document.getElementsByClassName('show');
    const expanded_elements = document.getElementsByClassName('custom-active');

    for (let i = 0; i < expanded_elements.length; ++i) {
      let item = expanded_elements[i]; 

        if (!item.lastElementChild.classList.contains('show')){
          item.classList.remove('custom-active');
        }

    }

  }
}
