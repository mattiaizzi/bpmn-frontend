import { RouteObject, useRoutes } from "react-router-dom";
import TopicCreate from "./pages/topic-create/topic-create";
import TopicList from "./pages/topic-list/topic-list.component";
import Topic from "./topics.component";

const topicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Topic />,
        children: [
            {
                index: true,
                element: <TopicList />
            },
            {
                path: "/create",
                element: <TopicCreate />
            }
        ]
    }
];

const TopicRouter = () => useRoutes(topicRoutes);

export default TopicRouter;