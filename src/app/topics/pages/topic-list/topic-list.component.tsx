import { Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import axios, { AxiosError } from 'axios';
import { makeStyles } from '@mui/styles';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { deleteTopic, getTopics } from '../../api/topic.api';
import { Topic } from '../../models/topic';
import TopicTable from './components/topic-table/topic-table';
import { useEffect } from 'react';
import { setTopics } from '../../../home/lib/util/RosClient';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    paper: {
        position: 'absolute',
        width: 400,
        border: '2px solid #000',
        padding: 2
    },
    button: {
        margin: 1,
    },
});

const TopicList = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: topics = [], refetch: fetchTopics } = useQuery<Topic[], Error>('getTopics', getTopics, {
        enabled: true,
        initialData: [],
    });

    const deleteTopicMutation = useMutation(deleteTopic, {
        onError: (error: AxiosError | Error) => {
            if(axios.isAxiosError(error)) {
                console.log((error as AxiosError)?.response?.data);
            } else {
                console.log(error)
            }
        },
    });


    useEffect(() => {
        return () => {
            queryClient.removeQueries('getTopics');
        }
    }, [queryClient]);

    const onDeleteTopic = (id: string) => {
        deleteTopicMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries('getTopics');
            fetchTopics();
        });
    }

    const reloadTopics = () => {
        setTopics(topics);
    }

    return (
        <Paper className={classes.root}>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    onClick={() => navigate('create')}
                    startIcon={<AddIcon />}
                >
                    AGGIUNGI
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    onClick={reloadTopics}
                    startIcon={<AutorenewIcon />}
                >
                    CARICA TOPICS
                </Button>
            </div>
            {topics.length === 0 ? (
                <h1>Nessun topic presente</h1>
            ) : (
                <TopicTable topics={topics} onDeleteTopic={onDeleteTopic} />
            )}
        </Paper>
    );

}

export default TopicList;