import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { FabricHttpErrorHandlerInterceptorService } from './interceptors/fabric-http-error-handler-interceptor.service';
import { mockGroupsResponse, mockRolesResponse, mockUserResponse } from './fabric-auth-user.service.mock';
import { FabricAuthUserService } from './fabric-auth-user.service';
import { IRole } from '../models/role.model';
import { IUser } from '../models/user.model';
import { IGroup } from '../models/group.model';
import { IAccessControlConfigService } from './access-control-config.service';
import { MockAccessControlConfigService } from './access-control-config.service.mock';

describe('FabricAuthUserService', () => {
  const idP = 'ad';
  const subjectId = 'sub123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FabricAuthUserService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: FabricHttpErrorHandlerInterceptorService,
          multi: true
        },
        {
          provide: 'IAccessControlConfigService',
          useClass: MockAccessControlConfigService
        }
      ]
    });
  });

  it(
    'getUserGroups should deserialize all properties',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          service.getUserGroups(idP, subjectId).subscribe(returnedGroups => {
            assertMockUserGroupsResponse(returnedGroups);
          });

          const req = httpTestingController.expectOne(
            encodeURI(
              `${
                FabricAuthUserService.baseUserApiUrl
              }/${idP}/${subjectId}/groups`
            )
          );
          expect(req.request.method).toBe('GET');
          req.flush(mockGroupsResponse, { status: 200, statusText: 'OK' });
          httpTestingController.verify();
        }
      )
    )
  );

  it(
    'getUserGroups error should be caught',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          service
            .getUserGroups(idP, subjectId)
            .catch(error => {
              expect(Observable.of(error)).toBeTruthy();
              expect(error.statusCode).toBe(404);
              expect(error.message).toBe('User not found');
              return Observable.of(error);
            })
            .subscribe();

          const req = httpTestingController.expectOne(
            encodeURI(
              `${
                FabricAuthUserService.baseUserApiUrl
              }/${idP}/${subjectId}/groups`
            )
          );
          expect(req.request.method).toBe('GET');
          req.flush(null, { status: 404, statusText: 'User not found' });
          httpTestingController.verify();
        }
      )
    )
  );

  it(
    'getUserRoles should deserialize all properties',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          service.getUserRoles(idP, subjectId).subscribe(returnedRoles => {
            assertMockUserRolesResponse(returnedRoles);
          });

          const req = httpTestingController.expectOne(
            `${FabricAuthUserService.baseUserApiUrl}/${idP}/${subjectId}/roles`
          );
          expect(req.request.method).toBe('GET');
          req.flush(mockRolesResponse, { status: 200, statusText: 'OK' });
          httpTestingController.verify();
        }
      )
    )
  );

  it(
    'getUserRoles error should be caught',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          service
            .getUserRoles(idP, subjectId)
            .catch(error => {
              expect(Observable.of(error)).toBeTruthy();
              expect(error.statusCode).toBe(404);
              expect(error.message).toBe('User not found');
              return Observable.of(error);
            })
            .subscribe();

          const req = httpTestingController.expectOne(
            encodeURI(
              `${
                FabricAuthUserService.baseUserApiUrl
              }/${idP}/${subjectId}/roles`
            )
          );
          expect(req.request.method).toBe('GET');
          req.flush(null, { status: 404, statusText: 'User not found' });
          httpTestingController.verify();
        }
      )
    )
  );

  it(
    'addRolesToUser should deserialize all properties',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          service
            .addRolesToUser(idP, subjectId, mockRolesResponse)
            .subscribe(returnedUser => {
              assertMockUserResponse(returnedUser);
            });

          const req = httpTestingController.expectOne(
            encodeURI(
              `${
                FabricAuthUserService.baseUserApiUrl
              }/${idP}/${subjectId}/roles`
            )
          );
          expect(req.request.method).toBe('POST');
          req.flush(mockUserResponse, { status: 201, statusText: 'Created' });
          httpTestingController.verify();
        }
      )
    )
  );

  it(
    'addRolesToUser error should be caught',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          service
            .addRolesToUser(idP, subjectId, mockRolesResponse)
            .catch(error => {
              expect(Observable.of(error)).toBeTruthy();
              expect(error.statusCode).toBe(404);
              expect(error.message).toBe('User not found');
              return Observable.of(error);
            })
            .subscribe();

          const req = httpTestingController.expectOne(
            encodeURI(
              `${
                FabricAuthUserService.baseUserApiUrl
              }/${idP}/${subjectId}/roles`
            )
          );
          expect(req.request.method).toBe('POST');
          req.flush(null, { status: 404, statusText: 'User not found' });
          httpTestingController.verify();
        }
      )
    )
  );

  it(
    'removeRolesFromUser should deserialize all properties',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          const role1: IRole = {  name: 'admin', grain: 'dos', securableItem: 'datamart' };
          role1.parentRole = 'admin_parent';

          const role2: IRole = {  name: 'superuser', grain: 'dos', securableItem: 'datamart'};
          role2.childRoles = ['dos_child1', 'dos_child2'];
          const rolesArray: IRole[] = [role1, role2];

          service
            .removeRolesFromUser(idP, subjectId, rolesArray)
            .subscribe(returnedUser => {
              assertMockUserResponse(returnedUser);
            });

          const req = httpTestingController.expectOne(
            encodeURI(
              `${
                FabricAuthUserService.baseUserApiUrl
              }/${idP}/${subjectId}/roles`
            )
          );
          expect(req.request.method).toBe('DELETE');
          expect(req.request.body).toBeDefined();

          const requestBody = JSON.stringify(req.request.body);
          expect(requestBody).toBe(JSON.stringify(rolesArray));
          req.flush(mockUserResponse, {
            status: 204,
            statusText: 'No Content'
          });
          httpTestingController.verify();
        }
      )
    )
  );

  it(
    'removeRolesFromUser error should be caught',
    async(
      inject(
        [HttpClient, HttpTestingController, FabricAuthUserService],
        (
          httpClient: HttpClient,
          httpTestingController: HttpTestingController,
          service: FabricAuthUserService
        ) => {
          service
            .removeRolesFromUser(idP, subjectId, mockRolesResponse)
            .catch(error => {
              expect(Observable.of(error)).toBeTruthy();
              expect(error.statusCode).toBe(404);
              expect(error.message).toBe('User not found');
              return Observable.of(error);
            })
            .subscribe();

          const req = httpTestingController.expectOne(
            encodeURI(
              `${
                FabricAuthUserService.baseUserApiUrl
              }/${idP}/${subjectId}/roles`
            )
          );
          expect(req.request.method).toBe('DELETE');
          req.flush(null, { status: 404, statusText: 'User not found' });
          httpTestingController.verify();
        }
      )
    )
  );

  function assertMockUserResponse(returnedUser: IUser) {
    expect(returnedUser.id).toBe(idP);
    expect(returnedUser.name).toBe('First Last');
    expect(returnedUser.subjectId).toBe(subjectId);
    assertMockUserGroupsResponse(returnedUser.groups);
    assertMockUserRolesResponse(returnedUser.roles);
  }

  function assertMockUserGroupsResponse(returnedGroups: IGroup[]) {
    expect(returnedGroups).toBeDefined();
    expect(returnedGroups[0].groupName).toBe('Group 1');
    expect(returnedGroups[1].groupName).toBe('Group 2');
  }

  function assertMockUserRolesResponse(returnedRoles: IRole[]) {
    expect(returnedRoles).toBeDefined();
    expect(returnedRoles.length).toBe(2);

    const adminRole = returnedRoles[0];
    expect(adminRole.name).toBe('admin');
    expect(adminRole.grain).toBe('dos');
    expect(adminRole.securableItem).toBe('datamart');
    expect(adminRole.parentRole).toBe('admin_parent');

    const superUserRole = returnedRoles[1];
    expect(superUserRole.name).toBe('superuser');
    expect(superUserRole.grain).toBe('dos');
    expect(superUserRole.securableItem).toBe('datamart');
    expect(superUserRole.childRoles).toBeDefined();
    expect(superUserRole.childRoles.length).toBe(2);
    expect(superUserRole.childRoles[0]).toBe('dos_child1');
    expect(superUserRole.childRoles[1]).toBe('dos_child2');
  }
});
