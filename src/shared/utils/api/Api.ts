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

export enum UAccountingEntityType {
  Individual = "individual",
  SoleTrader = "sole_trader",
  Company = "company",
}

export enum UAppUsageMode {
  PowerUser = "power_user",
  NonPowerUser = "non_power_user",
}

export enum UAppThemePreference {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export type TEntityId = string & {
  __brand: "uuid";
};

export interface IUserAppPreferences {
  theme?: UAppThemePreference | null;
  appUsageMode?: UAppUsageMode | null;
}

export interface IUserPreferences {
  id: TEntityId;
  appPreferences: IUserAppPreferences;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

/** From T, pick a set of properties whose keys are in the union K */
export type PickIUserExcludeKeysPassword = object;

/** Construct a type with the properties of T except for those in type K. */
export type OmitIUserPassword = PickIUserExcludeKeysPassword;

/**
 * Represents the month and day on which an accounting entity's fiscal year ends.
 * Defaults to December 31 for individuals. Companies and sole traders
 * may configure any valid calendar date (e.g., March 31, June 30).
 */
export interface IFiscalYearStart {
  /** @format double */
  month: number;
  /** @format double */
  day: number;
}

export interface IAccountingEntityOnboardingReq {
  name: string;
  entityType: UAccountingEntityType;
  operatingCountryCode: string;
  functionalCurrencyCode: string;
  reportingCurrencyCode: string;
  /**
   * Represents the month and day on which an accounting entity's fiscal year ends.
   * Defaults to December 31 for individuals. Companies and sole traders
   * may configure any valid calendar date (e.g., March 31, June 30).
   */
  fiscalYearStart: IFiscalYearStart;
  accountingMode: UAppUsageMode;
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

export interface IIndividualSignupReq {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAuthRes {
  authToken: string;
  refreshToken: string;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIAccountingEntityExcludeKeysFunctionalCurrencyOrReportingCurrency {
  id: TEntityId;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string;
  type: UAccountingEntityType;
  ownerId: TEntityId;
  /**
   * Represents the month and day on which an accounting entity's fiscal year ends.
   * Defaults to December 31 for individuals. Companies and sole traders
   * may configure any valid calendar date (e.g., March 31, June 30).
   */
  fiscalYearStart: IFiscalYearStart;
}

export interface IAccountingEntityRes {
  id: TEntityId;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string;
  type: UAccountingEntityType;
  ownerId: TEntityId;
  /**
   * Represents the month and day on which an accounting entity's fiscal year ends.
   * Defaults to December 31 for individuals. Companies and sole traders
   * may configure any valid calendar date (e.g., March 31, June 30).
   */
  fiscalYearStart: IFiscalYearStart;
  functionalCurrency: string;
  reportingCurrency: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
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
      baseURL: axiosConfig.baseURL || "/api/v1",
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
    params2?: AxiosRequestConfig,
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
    if (typeof formItem === "object" && formItem !== null) {
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
          isFileType ? formItem : this.stringifyFormItem(formItem),
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
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
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
     */
    getUserPreferences: (params: RequestParams = {}) =>
      this.request<IUserPreferences, any>({
        path: `/users/preferences`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get authenticated user profile
     *
     * @tags User
     * @name GetAuthUserProfile
     * @request GET:/users/profile
     */
    getAuthUserProfile: (params: RequestParams = {}) =>
      this.request<OmitIUserPassword, any>({
        path: `/users/profile`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  onboarding = {
    /**
     * @description Onboard Accounting Entity
     *
     * @tags Onboarding
     * @name OnboardAccountingEntity
     * @request POST:/onboarding/accounting-entity
     */
    onboardAccountingEntity: (
      data: IAccountingEntityOnboardingReq,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/onboarding/accounting-entity`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  currencies = {
    /**
     * @description Get Currencies
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
          code: string;
          /** @format double */
          minorUnit: number;
        }[],
        any
      >({
        path: `/currencies`,
        method: "GET",
        format: "json",
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
    signupWithEmail: (data: IIndividualSignupReq, params: RequestParams = {}) =>
      this.request<void, IApiError>({
        path: `/auth/signup-with-email`,
        method: "POST",
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
      params: RequestParams = {},
    ) =>
      this.request<IAuthRes, IApiError>({
        path: `/auth/signup/complete`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  accountingEntities = {
    /**
     * @description Get all accounting entities of an authenticated user
     *
     * @tags Accounting Entity
     * @name GetAll
     * @request GET:/accounting-entities
     */
    getAll: (params: RequestParams = {}) =>
      this.request<IAccountingEntityRes[], any>({
        path: `/accounting-entities`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
