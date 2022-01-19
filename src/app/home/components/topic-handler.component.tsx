import { Button, Card, CardContent, CardHeader, Collapse, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Theme } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { ros, Topic } from "../lib/util/RosClient";

const TopicHandler = () => {
    const [topics, setTopics] = useState<{ name: string, ref: any }[]>([]);

    useEffect(() => () => topics.forEach((topic: any) => topic.ref.unsubscribe()), []);

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<{ name: string, messageType: string }>({
        defaultValues: {},
    });

    const onSubmit = (form: { name: string, messageType: string }) => {
        setTopics(oldState => [...oldState, {
            name: form.name, ref: new Topic({
                ros: ros,
                name: form.name,
                messageType: form.messageType,
            })
        }]);
        setValue('name', '');
        setValue('messageType', '');

    }

    const name = register('name', {
        required: 'Required',
        validate: (value) => !topics.some(t => t.name = value),
    });

    const messageType = register('messageType', {
        required: 'Required',
    });

    const handleDelete = (topic: { name: string, ref: any }) => {
        setTopics(oldState => {
            const index = oldState.findIndex(t => t.name === topic.name);
            const removed = oldState.splice(index, 1);
            removed.forEach(r => r.ref.unsubscribe());
            return [...oldState];
        })
    }

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="caption">
                    In questa sezione è possibile aggiungere sottoscrizioni ai topic e inviare messaggi sui topic. Al momento è possibile solamente leggere e inviare messagi del tipo {"{ data: 'qui il tuo messaggio'}"}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    id="name"
                    helperText={errors.name ? errors.name.message || 'Topic già presente' : null}
                    variant="outlined"
                    label="Name"
                    error={!!errors.name}
                    name={name.name}
                    onBlur={name.onBlur}
                    onChange={name.onChange}
                    inputRef={name.ref}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    id="messageType"
                    helperText={errors.messageType ? errors.messageType.message : null}
                    variant="outlined"
                    label="Message Type"
                    error={!!errors.messageType}
                    name={messageType.name}
                    onBlur={messageType.onBlur}
                    onChange={messageType.onChange}
                    inputRef={messageType.ref}
                />
            </Grid>
            <Grid item xs={4}>
                <Button onClick={handleSubmit(onSubmit)} variant="outlined" color="primary">
                    Subscribe
                </Button>
            </Grid>
            <Grid item xs={12} >
                {topics.map(t => <TopicCard key={t.name} topic={t} onDelete={handleDelete} />)}
            </Grid>
        </>
    );
};

const TopicCard: React.FC<
    {
        topic: { name: string, ref: any },
        onDelete: (topic: { name: string, ref: any }) => void
    }
> = ({ topic, onDelete }) => {
    const [messages, setMessages] = useState<any>([]);
    const [expanded, setExpanded] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        topic.ref.subscribe(function (message: any) {
            setMessages((old: any) => [...old, message?.data]);
        });
    }, [])

    const handleExpandClick = () => {
        setExpanded(oldState => !oldState);
    }

    const sendMessage = () => {
        if (message) {
            topic.ref.publish({ data: message });
        }
    }
    return (
        <Card sx={{ width: 345 }}>
            <CardHeader
                action={
                    <IconButton onClick={() => onDelete(topic)}>
                        <CloseIcon />
                    </IconButton>
                }
                title={topic.name}
            />
            <CardContent>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={message}
                                onChange={(event) => { setMessage(event.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" color="primary">
                                Invia
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton
                    sx={{
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto',
                        transition: (theme: Theme) => theme.transitions.create('transform', {
                            duration: theme.transitions.duration.shortest,
                        })
                    }
                    }
                    onClick={handleExpandClick}>
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {messages.map((message: any) => (<Typography key={message} variant="body1">
                        {message}
                    </Typography>))
                    }
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default TopicHandler;

