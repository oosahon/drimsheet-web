import type { RouteObject } from 'react-router-dom';

type TBasePath = `/${string}`;

export type TModuleRoutes = (basePath: TBasePath) => RouteObject;
