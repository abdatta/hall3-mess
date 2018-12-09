import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@control/nav/nav.component';
import { NotifyComponent } from '@control/notify/notify.component';
import { ChangemesssecypasswordComponent } from '@control/changemesssecypassword/changemesssecypassword.component';
import { EdititemComponent } from '@control/edititem/edititem.component';
import { MakebillsComponent } from '@control/makebills/makebills.component';

const controlRoutes: Routes = [
    {
        path: '',
        component: NavComponent,
        children : [
            { path: '', redirectTo: 'notify', pathMatch: 'full' },
            { path: 'notify', component: NotifyComponent},
            { path: 'edititem', component: EdititemComponent},
            { path: 'changepassword', component: ChangemesssecypasswordComponent},
            { path: 'makebills', component: MakebillsComponent},
        ]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(controlRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ControlRouterModule {}
