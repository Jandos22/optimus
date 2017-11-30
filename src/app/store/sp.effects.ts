import { SpImage } from './../shared/interfaces/sp-image.model';
import { ApiPath } from './../shared/constants/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';

import * as sprLib from 'sprestlib';
import * as sp from './sp.actions';
import * as application from '../store/application.actions';
import { FormDigestValue } from '../shared/interfaces/form-digest-value.model';
import { SpAddItem } from '../shared/interfaces/sp-add-item.model';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';

import * as $ from 'jquery/dist/jquery.min.js';

@Injectable()
export class SpEffects {

    ArrayOfImagesToUpload$: Observable<any>;

    @Effect({dispatch: false}) addItem = this.actions$
        .ofType(sp.ADD_ITEM)
        .switchMap((action: sp.AddItem) => {

            return this.http.post(
                ApiPath + 'contextinfo',
                { headers: new HttpHeaders().set('accept', 'application/json;odata=verbose') })
                .map(
                    // success get FDV (kinda authorization token)
                    (fdv_object: FormDigestValue) => {

                        if (!action.imageListName && !action.image) {
                            return {
                                body: action.body,
                                listname: action.itemListName,
                                fdv: fdv_object.FormDigestValue
                            };
                        } else if (action.imageListName && action.image) {
                            return {
                                body: action.body,
                                listname: action.itemListName,
                                hasImage: true,
                                image: action.image,
                                imageListName: action.imageListName,
                                fdv: fdv_object.FormDigestValue
                            };
                        }

                    // if error when getting FDV then do something
                    }, (error) => {
                        console.log(error);
                    }
                );
        })
        .switchMap((item: SpAddItem) => {

            console.log(item);

            const spItemObject = {
                ...item.body,
                __metadata: {
                    type: this.getListEntity(item.listname)
                }
            };

            return this.http.post(
                this.getUrlListItems(item.listname),
                JSON.stringify(spItemObject),
                { headers: new HttpHeaders()
                    .set('accept', 'application/json;odata=verbose')
                    .append('content-type', 'application/json;odata=verbose')
                    .append('X-RequestDigest', item.fdv)
                })
                .switchMap((result: any) => {
                    // if successfull then upload images if any
                    if (item.hasImage) {

                        console.log(item.image.ArrayBuffer.byteLength);

                        return $.ajax({
                            url: this.getUrlImageListItems(item.imageListName, item.image.Filename),
                            type: 'POST',
                            data: item.image.ArrayBuffer,
                            processData: false,
                            headers: {
                                'accept': 'application/json;odata=verbose',
                                'X-RequestDigest': item.fdv
                            },
                            sucess: (res) => res,
                            error: (err) => err
                        });

                        // return this.http.post(
                        //     this.getUrlImageListItems(item.imageListName, item.image.Filename),
                        //     item.image.ArrayBuffer,
                        //     { headers: new HttpHeaders()
                        //         .set('accept', 'application/json;odata=verbose')
                        //         .append('X-RequestDigest', item.fdv)
                        //         .append('content-type', 'undefined')
                        //         .append('processData', 'false')
                        //         // .append('transformRequest', '')
                        //     }
                        // ).map((good) => good, (bad) => console.log(bad));

                    } else {
                        return result;
                    }

                });
        })
        .map(
            (result) => {
                console.log('only item added', result);
            }, (error) => {
                console.log(error);
            }
        );

    constructor(private actions$: Actions,
                private http: HttpClient) {

        this.ArrayOfImagesToUpload$ = Observable[''];
    }

    getListEntity(listname: string) {
        return 'SP.Data.' + listname.charAt(0).toUpperCase() + listname.slice(1) + 'ListItem';
    }

    getUrlListItems(listname: string) {
        return ApiPath + 'web/lists/getbytitle(\'' + listname + '\')/items';
    }

    getUrlImageListItems(imagelist: string, filename: string) {
        return ApiPath + 'web/lists/getbytitle(\'' + imagelist + '\')/rootfolder/files/add(url=\'' + filename + '\',overwrite=\'true\')';
    }
}
