import httpClient from "../../utils/axios-client";
import { Topic } from "../models/topic";

const serviceName = '/topic';

export const getTopic = (id: string) => httpClient.get<Topic>(`${serviceName}/${id}`).then(response => response.data);

export const saveTopic = (topic: Topic) =>
    httpClient.post<Topic>(`${serviceName}`, topic).then(response => response.data);

export const getTopics = () => httpClient.get<{topics: Topic[]}>(`${serviceName}`).then(response => response.data.topics);

export const deleteTopic = (id: string) => httpClient.delete<Topic>(`${serviceName}/${id}`).then(response => response.data);

export const updateTopic = (topic: Topic) => httpClient.put<Topic[]>(`${serviceName}/${topic._id}`, topic).then(response => response.data);

