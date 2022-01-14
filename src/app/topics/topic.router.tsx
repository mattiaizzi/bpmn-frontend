import { RouteObject, useRoutes } from "react-router-dom";
import Topic from "./topics.component";

const topicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Topic />,
        children: []
    }
];

const TopicRouter = () => useRoutes(topicRoutes);

export default TopicRouter;