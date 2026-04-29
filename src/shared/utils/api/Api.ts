/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum UJurisdictionCode {
  AD = 'AD',
  AE = 'AE',
  AR = 'AR',
  AT = 'AT',
  AU = 'AU',
  BD = 'BD',
  BE = 'BE',
  BR = 'BR',
  CA = 'CA',
  CH = 'CH',
  CI = 'CI',
  CL = 'CL',
  CM = 'CM',
  CN = 'CN',
  CO = 'CO',
  CY = 'CY',
  CZ = 'CZ',
  DE = 'DE',
  DK = 'DK',
  DZ = 'DZ',
  EE = 'EE',
  EG = 'EG',
  ES = 'ES',
  FI = 'FI',
  FR = 'FR',
  GB = 'GB',
  GH = 'GH',
  GR = 'GR',
  HK = 'HK',
  HR = 'HR',
  HU = 'HU',
  ID = 'ID',
  IE = 'IE',
  IL = 'IL',
  IN = 'IN',
  IT = 'IT',
  JP = 'JP',
  KE = 'KE',
  KR = 'KR',
  LT = 'LT',
  LU = 'LU',
  LV = 'LV',
  MA = 'MA',
  MC = 'MC',
  MT = 'MT',
  MX = 'MX',
  MY = 'MY',
  NG = 'NG',
  NL = 'NL',
  NO = 'NO',
  NZ = 'NZ',
  PE = 'PE',
  PH = 'PH',
  PK = 'PK',
  PL = 'PL',
  PT = 'PT',
  RO = 'RO',
  RU = 'RU',
  SA = 'SA',
  SE = 'SE',
  SG = 'SG',
  SI = 'SI',
  SK = 'SK',
  SM = 'SM',
  SN = 'SN',
  TH = 'TH',
  TR = 'TR',
  TW = 'TW',
  TZ = 'TZ',
  UA = 'UA',
  UG = 'UG',
  US = 'US',
  VA = 'VA',
  VN = 'VN',
  ZA = 'ZA',
}

export enum UCurrencyCode {
  AED = 'AED',
  ARS = 'ARS',
  AUD = 'AUD',
  BDT = 'BDT',
  BRL = 'BRL',
  CAD = 'CAD',
  CHF = 'CHF',
  CLP = 'CLP',
  CNY = 'CNY',
  COP = 'COP',
  CZK = 'CZK',
  DKK = 'DKK',
  DZD = 'DZD',
  EGP = 'EGP',
  EUR = 'EUR',
  GBP = 'GBP',
  GHS = 'GHS',
  HKD = 'HKD',
  HUF = 'HUF',
  IDR = 'IDR',
  ILS = 'ILS',
  INR = 'INR',
  JPY = 'JPY',
  KES = 'KES',
  KRW = 'KRW',
  MAD = 'MAD',
  MXN = 'MXN',
  MYR = 'MYR',
  NGN = 'NGN',
  NOK = 'NOK',
  NZD = 'NZD',
  PEN = 'PEN',
  PHP = 'PHP',
  PKR = 'PKR',
  PLN = 'PLN',
  RON = 'RON',
  RUB = 'RUB',
  SAR = 'SAR',
  SEK = 'SEK',
  SGD = 'SGD',
  THB = 'THB',
  TRY = 'TRY',
  TWD = 'TWD',
  TZS = 'TZS',
  UAH = 'UAH',
  UGX = 'UGX',
  USD = 'USD',
  VND = 'VND',
  XAF = 'XAF',
  XOF = 'XOF',
  ZAR = 'ZAR',
}

export enum UPeriodUnit {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  Year = 'year',
}

export enum UAccountingEntityType {
  Individual = 'individual',
  SoleTrader = 'sole_trader',
  PrivateCompany = 'private_company',
}

export enum UExchangeRateType {
  Official = 'official',
  Negotiated = 'negotiated',
}

export enum UAppUsageModePreference {
  PowerUser = 'power_user',
  NonPowerUser = 'non_power_user',
}

export enum UAppThemePreference {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export type TEntityId = string & {
  __brand: 'uuid';
};

export interface IUserAppPreferences {
  theme?: UAppThemePreference | null;
  appUsageMode?: UAppUsageModePreference | null;
}

export interface IUserPreferences {
  id: TEntityId;
  appPreferences: IUserAppPreferences;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface IApiValidationError {
  field: string;
  message: string;
}

export interface IApiError {
  message: string;
  validationErrors?: IApiValidationError[];
  cause?: any;
}

export interface IUser {
  id: TEntityId;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
}

export interface IUserSignupReq {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAccessToken {
  accessToken: string;
}

export interface IEmailLoginReq {
  email: string;
  password: string;
}

export interface IResetPasswordReq {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IMoneyDto {
  /** @format double */
  amount: number;
  currencyCode: string;
  isMinorUnit: boolean;
}

export interface IExchangeRateDto {
  baseCurrencyCode: string;
  targetCurrencyCode: string;
  /** @format double */
  rate: number;
  type: UExchangeRateType;
  /** @format date-time */
  asOf: string;
  source: string;
  /** @format double */
  id?: number;
}

export interface IOpeningBalanceDto {
  amount: IMoneyDto;
  exchangeRate: IExchangeRateDto | null;
}

export interface IPettyCashAccountCreationReq {
  name: string;
  currencyCode: string;
  isControlAccount: boolean;
  controlAccountCode?: string;
  openingBalance: IOpeningBalanceDto | null;
}

/** Fiscal year creation DTO */
export interface IFiscalYearCreationDto {
  /** @format date-time */
  startDate: string;
  /** @format date-time */
  endDate: string;
}

export interface IPeriodCreationDto {
  unit: UPeriodUnit;
  /** @format double */
  count: number;
}

/** Accounting entity onboarding DTO */
export interface IAccountingEntityCreationDto {
  name: string;
  entityType: UAccountingEntityType;
  jurisdictionCode: string;
  accountingStandardCode: string;
  functionalCurrencyCode: string;
  reportingCurrencyCode: string;
  /** Fiscal year creation DTO */
  fiscalYear: IFiscalYearCreationDto;
  accountingPeriod: IPeriodCreationDto;
  reportingPeriod: IPeriodCreationDto;
  appUsageMode: UAppUsageModePreference;
}

export interface IAccountingStandardDto {
  individual: string[];
  sole_trader: string[];
  private_company: string[];
}

export interface IJurisdictionDto {
  code: string;
  name: string;
  currencyCode: string;
  accountingStandards: IAccountingStandardDto;
}

export interface IAccountingEntity {
  id: TEntityId;
  name: string;
  type: UAccountingEntityType;
  ownerId: TEntityId;
  functionalCurrencyCode: UCurrencyCode;
  jurisdictionCode: UJurisdictionCode;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<
  AxiosRequestConfig,
  'data' | 'params' | 'url' | 'responseType'
> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<
  AxiosRequestConfig,
  'data' | 'cancelToken'
> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || '/api/v1',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== 'string'
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title purple-ledger-core
 * @version 1.0.0
 * @license AGPL-3.0-or-later
 * @baseUrl /api/v1
 * @contact Osahon Oboite
 *
 * This repo contains the server-side source code for Purple Ledger's bookkeeping and tax app.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * @description Get user preferences
     *
     * @tags User
     * @name GetUserPreferences
     * @request GET:/users/preferences
     * @secure
     */
    getUserPreferences: (params: RequestParams = {}) =>
      this.request<IUserPreferences, IApiError>({
        path: `/users/preferences`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get authenticated user profile
     *
     * @tags User
     * @name GetAuthUserProfile
     * @request GET:/users/profile
     * @secure
     */
    getAuthUserProfile: (params: RequestParams = {}) =>
      this.request<IUser, IApiError>({
        path: `/users/profile`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  currencies = {
    /**
     * @description Gets all system currencies
     *
     * @tags Currency
     * @name GetCurrencies
     * @request GET:/currencies
     */
    getCurrencies: (params: RequestParams = {}) =>
      this.request<
        {
          name: string;
          symbol: string;
          code:
            | 'AED'
            | 'ARS'
            | 'AUD'
            | 'BDT'
            | 'BRL'
            | 'CAD'
            | 'CHF'
            | 'CLP'
            | 'CNY'
            | 'COP'
            | 'CZK'
            | 'DKK'
            | 'DZD'
            | 'EGP'
            | 'EUR'
            | 'GBP'
            | 'GHS'
            | 'HKD'
            | 'HUF'
            | 'IDR'
            | 'ILS'
            | 'INR'
            | 'JPY'
            | 'KES'
            | 'KRW'
            | 'MAD'
            | 'MXN'
            | 'MYR'
            | 'NGN'
            | 'NOK'
            | 'NZD'
            | 'PEN'
            | 'PHP'
            | 'PKR'
            | 'PLN'
            | 'RON'
            | 'RUB'
            | 'SAR'
            | 'SEK'
            | 'SGD'
            | 'THB'
            | 'TRY'
            | 'TWD'
            | 'TZS'
            | 'UAH'
            | 'UGX'
            | 'USD'
            | 'VND'
            | 'XAF'
            | 'XOF'
            | 'ZAR';
          /** @format double */
          minorUnit: number;
        }[],
        any
      >({
        path: `/currencies`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  auth = {
    /**
     * @description User signup with email and password
     *
     * @tags Auth
     * @name SignupWithEmail
     * @request POST:/auth/signup-with-email
     */
    signupWithEmail: (data: IUserSignupReq, params: RequestParams = {}) =>
      this.request<void, IApiError>({
        path: `/auth/signup-with-email`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Verify user email
     *
     * @tags Auth
     * @name VerifyEmail
     * @request POST:/auth/signup/complete
     */
    verifyEmail: (
      query: {
        token: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<IAccessToken, IApiError>({
        path: `/auth/signup/complete`,
        method: 'POST',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description User login with email and password
     *
     * @tags Auth
     * @name LoginWithEmail
     * @request POST:/auth/login-with-email
     */
    loginWithEmail: (data: IEmailLoginReq, params: RequestParams = {}) =>
      this.request<IAccessToken, IApiError>({
        path: `/auth/login-with-email`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get password reset link
     *
     * @tags Auth
     * @name GetPasswordResetLink
     * @request POST:/auth/get-password-reset-link
     */
    getPasswordResetLink: (
      data: {
        email: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, IApiError>({
        path: `/auth/get-password-reset-link`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Reset password
     *
     * @tags Auth
     * @name ResetPassword
     * @request POST:/auth/reset-password
     */
    resetPassword: (data: IResetPasswordReq, params: RequestParams = {}) =>
      this.request<IAccessToken, IApiError>({
        path: `/auth/reset-password`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Start the Google OAuth flow. Redirects the user to Google for authentication.
     *
     * @tags Auth
     * @name LoginWithGoogle
     * @request GET:/auth/oauth/google
     */
    loginWithGoogle: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/oauth/google`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description Google OAuth callback. Exchanges the Google user profile for an auth token and redirects to the client.
     *
     * @tags Auth
     * @name LoginWithGoogleCallback
     * @request GET:/auth/oauth/google/callback
     */
    loginWithGoogleCallback: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/oauth/google/callback`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description Refresh access token
     *
     * @tags Auth
     * @name RefreshAccessToken
     * @request POST:/auth/refresh-access-token
     */
    refreshAccessToken: (params: RequestParams = {}) =>
      this.request<IAccessToken, IApiError>({
        path: `/auth/refresh-access-token`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * @description Logout user
     *
     * @tags Auth
     * @name Logout
     * @request POST:/auth/logout
     */
    logout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/logout`,
        method: 'POST',
        ...params,
      }),
  };
  ledger = {
    /**
     * @description Create a new petty cash sub account
     *
     * @tags Ledger, Asset Account
     * @name MakePettyCashSubAccount
     * @request POST:/ledger/asset-accounts
     */
    makePettyCashSubAccount: (
      data: IPettyCashAccountCreationReq,
      params: RequestParams = {}
    ) =>
      this.request<void, IApiError>({
        path: `/ledger/asset-accounts`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  accounting = {
    /**
     * @description Create a new accounting entity
     *
     * @tags Accounting
     * @name CreateAccountingEntity
     * @request POST:/accounting/accounting-entity
     */
    createAccountingEntity: (
      data: IAccountingEntityCreationDto,
      params: RequestParams = {}
    ) =>
      this.request<void, IApiError>({
        path: `/accounting/accounting-entity`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get jurisdictions
     *
     * @tags Accounting
     * @name GetJurisdictions
     * @request GET:/accounting/jurisdictions
     */
    getJurisdictions: (params: RequestParams = {}) =>
      this.request<IJurisdictionDto[], any>({
        path: `/accounting/jurisdictions`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Get user accounting entities
     *
     * @tags Accounting
     * @name GetUserAccountingEntities
     * @request GET:/accounting/accounting-entities
     */
    getUserAccountingEntities: (params: RequestParams = {}) =>
      this.request<IAccountingEntity[], IApiError>({
        path: `/accounting/accounting-entities`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
