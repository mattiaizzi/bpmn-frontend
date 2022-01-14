import { lazy } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import Home from "./home/home.component";
import Layout from "./layout/layout.component";

const TopicRouter = lazy(() => import('./topics/topic.router'));

const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'topic/*',
                element:  <TopicRouter />
            }
        ]
    }
];

const AppRouter = () => useRoutes(appRoutes);

export default AppRouter;