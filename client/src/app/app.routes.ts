import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './_resolvers/member-detailed.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './_guards/admin.guard';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { ConfirmEmailChangeComponent } from './authentication/confirm-email-change/confirm-email-change.component';
import { WorkoutlogService } from './_services/workoutlog.service';
import { WorkoutLogComponent } from './workout-log/workout-log/workout-log.component';
import { WorkoutLogGuestComponent } from './workout-log-guest/workout-log-guest/workout-log-guest.component';
import { FoodDiaryComponent } from './food-diary/food-diary/food-diary.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    { path: 'confirm-email', component: ConfirmEmailComponent },
    { path: 'confirm-email-change', component: ConfirmEmailChangeComponent},
    { path: 'guest-workout-log', component: WorkoutLogGuestComponent},
    {
        path: '',
        runGuardsAndResolvers:'always',
        canActivate:[authGuard],
        children: [
            {path: 'workout-log', component: WorkoutLogComponent},
            {path: 'food-diary', component: FoodDiaryComponent},
            {path: 'members', component: MemberListComponent},
            {path: 'members/:username', component: MemberDetailComponent, resolve: {member: memberDetailedResolver}},
            {path: 'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard]},
            {path: 'lists', component: ListsComponent},
            {path: 'messages', component: MessagesComponent},
            {path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard]},
            {path: 'errors', component: TestErrorsComponent},
        ]
    },
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
