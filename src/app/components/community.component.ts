import { Component, OnInit } from '@angular/core';
import { CommunityService, Community } from '../services/community.service';
import { Config } from '../objects/config';

@Component({
  moduleId: module.id,
  selector: 'communities',
  templateUrl: 'community.component.html',
  styleUrls: ['community.component.css']
})
export class CommunityComponent implements OnInit {
  communities: Community[] = [];
  showSpinner = true;
  graphUrl: string;

  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    this.graphUrl = this.communityService.getGraphUrl();
    this.communityService.getCommunities().then(communities => {
      this.communities = communities;
      this.showSpinner = false;
    });
  }
}
