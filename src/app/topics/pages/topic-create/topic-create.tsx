import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { Button, FormControl, Grid, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { saveTopic } from '../../api/topic.api';
import { Topic } from '../../models/topic';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        padding: 3,
    },
    paper: {
        padding: 1,
        textAlign: 'center',
    },
    buttonContainer: {},
});

const TopicCreate: React.FC = () => {

    const classes = useStyles();

    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors, submitCount, isValid },
    } = useForm<Topic>({
        defaultValues: {},
    });

    const name = register('name', {
        required: 'Required',
    });

    const key = register('key', {
        required: 'Required',
    });

    const messageType = register('messageType', {
        required: 'Required',
    });

    const saveTopicMutation = useMutation(saveTopic, {
        onError: (error: AxiosError | Error) => {
            if(axios.isAxiosError(error)) {
                console.log((error as AxiosError)?.response?.data);
            } else {
                console.log(error)
            }
        },
    });

    const onSubmit = (form: Topic) => {
        saveTopicMutation.mutateAsync(form)
        .then(() => navigate('/topic'))
    }
    return <div className={classes.root}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="key"
                                helperText={errors.key ? errors.key.message : null}
                                variant="outlined"
                                label="Key"
                                error={!!errors.key}
                                name={key.name}
                                onBlur={key.onBlur}
                                onChange={key.onChange}
                                inputRef={key.ref}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="name"
                                helperText={errors.name ? errors.name.message : null}
                                variant="outlined"
                                label="Name"
                                error={!!errors.name}
                                name={name.name}
                                onBlur={name.onBlur}
                                onChange={name.onChange}
                                inputRef={name.ref}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <TextField
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
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button onClick={() => navigate('/topic')} variant="outlined" color="primary">
                        Annulla
                    </Button>
                    <Button type="submit" disabled={submitCount > 0 && !isValid} variant="outlined" color="primary">
                        Salva
                    </Button>
                </Grid>
            </Grid>
        </form>
    </div>
};

export default TopicCreate;