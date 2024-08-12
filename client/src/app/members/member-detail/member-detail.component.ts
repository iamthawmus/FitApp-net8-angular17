import { Component, computed, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { User } from '../../_models/user';
import { LikesService } from '../../_services/likes.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  private messageService = inject(MessageService);
  presenceService = inject(PresenceService);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private likeService = inject(LikesService);
  private router = inject(Router);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  user?: User | null;
  hasLiked = computed(() => this.likeService.likeIds().includes(this.member.id));

  ngOnInit(): void {
    this.user = this.accountService.currentUser();

    this.route.data.subscribe({
      next: data=>{
        this.member = data['member'];
        this.member && this.member.photos.map(p => {
          this.images.push(new ImageItem({src: p.url, thumb: p.url}));
        })
      }
    });

    this.route.paramMap.subscribe({
      next: _ => this.onRouterParamsChange()
    });

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    });
  }

  selectTab(heading: string){
    if(this.memberTabs){
      const messageTab = this.memberTabs.tabs.find(x=>x.heading === heading);
      if(messageTab) messageTab.active = true;
    }
  }

  onRouterParamsChange() {
    if(!this.user) return;
    if(this.messageService.hubConnection?.state === HubConnectionState.Connected 
        && this.activeTab?.heading === "Messages")
    {
      this.messageService.hubConnection.stop().then(() => {
        this.messageService.createHubConnection(this.user!!, this.member.username);
      });
    }
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    });
    if(this.activeTab.heading === 'Messages' && this.member){
      const user = this.accountService.currentUser();
      if(!user) return;
      this.messageService.createHubConnection(user, this.member.username);
    }
    else{
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  toggleLike() {
    this.likeService.toggleLike(this.member.id).subscribe({
      next: () => {
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member.id))
        } else{
          this.likeService.likeIds.update(ids => [...ids, this.member.id]);
        }
      }
    })
  }
}
