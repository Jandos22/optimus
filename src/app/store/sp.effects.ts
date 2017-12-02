// Constants

import { ApiPath } from './../shared/constants';

// Interfaces

import {
    SpImage,
    FormDigestValue } from './../models';

// Angular

import {
    HttpClient,
    HttpHeaders,
    HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// RxJs -----------------

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/debounceTime';

// NgRx ----------------

import { Effect, Actions } from '@ngrx/effects';
import * as sp from './sp.actions';
import * as application from '../store/application.actions';

// Libraries

import * as sprLib from 'sprestlib';
import * as $ from 'jquery/dist/jquery.min.js';

@Injectable()
export class SpEffects {


    // - - - - - - - - - - - - - - - -
    // Add new item to SharePoint list
    @Effect({dispatch: false}) addItem = this.actions$
        .ofType(sp.ADD_ITEM)
        .switchMap((action: sp.AddItem) => {

            // always get Form Digest Value first,
            // then use FDV to construct the real request
            return this.http
                .post(
                    ApiPath + 'contextinfo',
                    { headers: new HttpHeaders().set('accept', 'application/json;odata=verbose')})
                .switchMap(
                    // success get FDV (kinda authorization token)
                    (fdv: FormDigestValue) => {

                        const spItemObject = {
                            ...action.item,
                            __metadata: {
                                type: this.getListEntity(action.list)
                            }
                        };

                        return this.http
                            .post(
                                this.getUrlListItems(action.list),
                                JSON.stringify(spItemObject),
                                { headers: new HttpHeaders()
                                    .set('accept', 'application/json;odata=verbose')
                                    .append('content-type', 'application/json;odata=verbose')
                                    .append('X-RequestDigest', fdv.FormDigestValue) })
                            .map((res) => {
                                console.log('added', res);
                                return 'success';
                            })
                            .catch(this.handleError);
                        }
                )
                .catch(this.handleError);
        })
        .catch(this.handleError);


    // - - - - - - - - - - - - - - - -
    // upload image on SharePoint Image Library
    @Effect({dispatch: false}) addImage = this.actions$
    .ofType(sp.ADD_IMAGE)
    .switchMap((action: sp.AddImage) => {

        // always get Form Digest Value first,
        // then use FDV to construct the real request
        return this.http
            .post(
                ApiPath + 'contextinfo', // Url
                { headers: new HttpHeaders().set('accept', 'application/json;odata=verbose') })
            .switchMap(
                // success get FDV (kinda authorization token)
                (fdv: FormDigestValue) => {

                    const promise = $.ajax({
                        url: this.constructUrl_imageUpload(action.library, action.image.Filename),
                        type: 'POST',
                        data: action.image.ArrayBuffer,
                        processData: false,
                        headers: {
                            'accept': 'application/json;odata=verbose',
                            'X-RequestDigest': fdv.FormDigestValue
                        }
                    });

                    // use jQuery temporarily, as there is an issue with sp-rest-proxy
                    return Observable.fromPromise(promise);

                }
            ).map((res) => {
                console.log('uploaded', res);
            });
    });

    constructor(private actions$: Actions,
                private http: HttpClient) {}

    getListEntity(listname: string) {
        return 'SP.Data.' + listname.charAt(0).toUpperCase() + listname.slice(1) + 'ListItem';
    }

    getUrlListItems(listname: string) {
        return ApiPath + 'web/lists/getbytitle(\'' + listname + '\')/items';
    }

    constructUrl_imageUpload(imagelist: string, filename: string) {
        return ApiPath + 'web/lists/getbytitle(\'' + imagelist + '\')/rootfolder/files/add(url=\'' + filename + '\',overwrite=\'true\')';
    }

    getFDV() {
        return this.http.post(
            ApiPath + 'contextinfo',
            { headers: new HttpHeaders().set('accept', 'application/json;odata=verbose') })
            .toPromise();
    }

    handleError(res: Response) {
        console.log(res);
        return Observable.throw('Server Error');
    }
}
