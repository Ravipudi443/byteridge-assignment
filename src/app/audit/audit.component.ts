import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator'
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {
    AUDIT_DATA:Audit[] = [];
    public currentUser;
    dateForm:FormGroup;
    dateFormat:string='12hr';

    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService,
        private fb: FormBuilder
    ) {
    }
    displayedColumns: string[] = ['user', 'id', 'LoginTime', 'LogOutTime', 'IP'];
    adults = new MatTableDataSource(this.AUDIT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    ngOnInit() {
        this.loadAllAudits();
        this.authenticationService.currentUser.subscribe(x=> this.currentUser =x);
        this.dateForm = this.fb.group({
            date:''
        });

    }

    private loadAllAudits() {
        this.auditService.getAll().subscribe((res:any)=>{
            res.forEach(audit=>{
                this.AUDIT_DATA.push({
                    user:audit.user,
                    id: audit._id,
                    loginTime: audit.loginTime,
                    logoutTime: audit.logoutTime,
                    ip: audit.ip

                });
            });
            this.adults.data = this.AUDIT_DATA;
        });
    }

    public doFilter = (value: string) => {
        this.adults.filter = value.trim().toLocaleLowerCase();
      }

      changeDate(){
        this.dateForm.value.date ? this.dateFormat =this.dateForm.value.date : this.dateFormat;
      }

    ngAfterViewInit() {
      this.adults.paginator = this.paginator;
      this.adults.sort = this.sort;

    }
}