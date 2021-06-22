import axios from 'axios';

import {makeReportService} from './makeReportService';
import {makeAuthService} from './makeAuthService';
import {makeHttpService} from "./makeHttpService";
import {makeUserService} from "./makeUserService";
import {makeFormsService} from "./makeFormsService";
import {makeUtilsService} from "./makeUtilsService";

export const AuthSvc = makeAuthService(axios);
export const HttpSvc = makeHttpService(axios, AuthSvc);
export const ReportSvc = makeReportService(HttpSvc);
export const UserSvc = makeUserService(HttpSvc);
export const FormsSvc = makeFormsService(HttpSvc);
export const UtilsSvc = makeUtilsService();


